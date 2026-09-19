import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));

// Lazy initializer for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

function generateFallbackAnalysis(evidencePayload: any[], customWarning?: string) {
  const unverified = evidencePayload.filter((d: any) => d.status === "UNVERIFIED");
  const reviewReq = evidencePayload.filter((d: any) => d.status === "REVIEW REQUIRED");
  const verified = evidencePayload.filter((d: any) => d.status === "VERIFIED");

  return {
    source: "deterministic_ruleset",
    warning: customWarning || "Displaying deterministic heuristic threat analysis based on verified registry evidence.",
    analysis: {
      summary: `Identified ${evidencePayload.length} dependencies (${verified.length} verified, ${unverified.length} unverified, ${reviewReq.length} requiring review). ${
        unverified.length > 0
          ? `High alert: Detected ${unverified.length} non-existent package(s) on ${evidencePayload[0]?.ecosystem || "registry"} that could indicate LLM hallucination or typosquatting bait.`
          : "All non-built-in packages exist on the authoritative registry."
      }`,
      overallRisk: unverified.length > 0 ? "Critical" : reviewReq.length > 0 ? "Medium" : "Low",
      verifiedFacts: [
        ...verified.map(
          (v: any) =>
            `[REGISTRY FACT] Package '${v.packageName}' exists on ${v.ecosystem} (Latest: ${v.registryData?.latestVersion || "registered"}, License: ${v.registryData?.license || "specified"}).`
        ),
        ...unverified.map(
          (u: any) =>
            `[REGISTRY FACT] Package '${u.packageName}' does NOT exist on ${u.ecosystem} (HTTP 404 response).`
        ),
        ...reviewReq.map(
          (r: any) =>
            `[REGISTRY FACT] Package '${r.packageName}' flagged for review (${r.reviewReason || "alias or built-in"}).`
        ),
      ],
      suspiciousSignals: [
        ...unverified.map((u: any) => ({
          package: u.packageName,
          severity: "critical" as const,
          signal: "Nonexistent Package on Public Registry (HTTP 404)",
          explanation: `The package '${u.packageName}' was not found on ${u.ecosystem}. In AI-generated code, this is a classic indicator of an LLM package hallucination or a pre-configured typosquatting attack vector. Running install on this package will fail or could match malicious packages if registered in the future.`,
        })),
        ...reviewReq
          .filter((r: any) => r.isNormalized)
          .map((r: any) => ({
            package: r.packageName,
            severity: "warning" as const,
            signal: `Module Normalization Required (${r.importName} → ${r.packageName})`,
            explanation: `The code imports '${r.importName}', but the distribution package on ${r.ecosystem} is named '${r.packageName}'. While legitimate, confirm that '${r.packageName}' is the intended upstream distribution.`,
          })),
        ...reviewReq
          .filter((r: any) => r.isStandardLibrary)
          .map((r: any) => ({
            package: r.packageName,
            severity: "info" as const,
            signal: `Runtime Built-in Module (${r.packageName})`,
            explanation: `'${r.packageName}' is built into the language standard runtime. It must not be installed via package managers.`,
          })),
      ],
      securityAdvisory:
        "CRITICAL SECURITY BOUNDARY: Registry verification confirms that a package is registered and published on PyPI/npm, but DOES NOT guarantee that its source code is safe, benign, or free from vulnerabilities. Always conduct code audits, verify maintainer provenance, and inspect release notes before running installation commands.",
      recommendations: [
        unverified.length > 0
          ? "Immediately remove or replace unverified packages before executing any terminal install commands."
          : "Verify package integrity and pin exact package versions in your lockfile.",
        "Never execute 'pip install' or 'npm install' with unfiltered AI-generated dependency lists.",
        "Use the 'Copy Verified Packages Only' feature to isolate only confirmed dependencies.",
      ],
      analyzedAt: new Date().toISOString(),
    },
  };
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "DepGuard AI Backend",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// Threat Analysis API Route
// Strictly accepts ONLY verified dependency evidence - NEVER user source code!
app.post("/api/threat-analysis", async (req, res) => {
  try {
    const { dependencies, language } = req.body;

    if (!dependencies || !Array.isArray(dependencies)) {
      return res.status(400).json({
        error: "Invalid request. An array of verified dependencies is required.",
      });
    }

    // Sanitize evidence payload: Send ONLY registry facts and verification statuses
    const evidencePayload = dependencies.map((dep: any) => ({
      packageName: dep.packageName,
      importName: dep.importName,
      isNormalized: dep.isNormalized,
      ecosystem: dep.ecosystem,
      status: dep.status,
      reviewReason: dep.reviewReason || null,
      isStandardLibrary: !!dep.isStandardLibrary,
      registryData: dep.registryMetadata
        ? {
            exists: dep.registryMetadata.exists,
            latestVersion: dep.registryMetadata.latestVersion || null,
            license: dep.registryMetadata.license || null,
            summary: dep.registryMetadata.summary || null,
            errorReason: dep.registryMetadata.errorReason || null,
          }
        : null,
    }));

    const ai = getGeminiClient();

    if (!ai) {
      return res.json(generateFallbackAnalysis(evidencePayload));
    }

    // Call Gemini API with structured schema and strict security instructions
    const prompt = `You are DepGuard AI's Cybersecurity Threat Analyzer.
Analyze the following dependency verification evidence collected statically from a ${language || "software"} project.

IMPORTANT CONSTRAINTS:
1. ONLY analyze the provided registry evidence. The user's source code is NOT provided and must not be guessed.
2. Clearly distinguish VERIFIED REGISTRY FACTS from AI-generated analysis.
3. NEVER claim or imply that a verified package is automatically "safe" or "benign" - registry existence only proves it exists on PyPI/npm, NOT that it is malware-free.
4. NEVER invent package information, version numbers, or fake vulnerabilities.
5. Identify suspicious signals such as:
   - Nonexistent packages (HTTP 404) - high risk of LLM hallucination / slopsquatting / typosquatting.
   - Discrepancies between imported module names and installable package names (normalization).
   - Standard library modules that shouldn't be installed via package managers.
   - Registry unavailability or timeout uncertainty.
6. Provide actionable developer recommendations in simple, professional, developer-friendly language.

EVIDENCE DATA:
${JSON.stringify(evidencePayload, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an expert software supply chain security analyst. Provide a factual, cautious, and accurate risk analysis strictly adhering to zero-trust principles. Never declare any package safe.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "High-level summary of verification findings in simple developer-friendly language.",
            },
            overallRisk: {
              type: Type.STRING,
              description: "Overall risk level: Low, Medium, High, or Critical.",
            },
            verifiedFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Strictly verified registry facts from the upstream API evidence.",
            },
            suspiciousSignals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  package: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "critical, warning, or info" },
                  signal: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["package", "severity", "signal", "explanation"],
              },
              description: "Suspicious or notable signals detected from evidence.",
            },
            securityAdvisory: {
              type: Type.STRING,
              description: "Clear reminder that registry existence does NOT guarantee package safety.",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Concrete actionable recommendations for the developer.",
            },
          },
          required: [
            "summary",
            "overallRisk",
            "verifiedFacts",
            "suspiciousSignals",
            "securityAdvisory",
            "recommendations",
          ],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const analysis = JSON.parse(text);
    analysis.analyzedAt = new Date().toISOString();

    res.json({
      source: "gemini-3.8-flash",
      analysis,
    });
  } catch (error: any) {
    console.warn("Gemini API call failed or timed out, activating deterministic threat analysis fallback:", error?.message);
    const { dependencies } = req.body || {};
    if (Array.isArray(dependencies)) {
      const fallback = generateFallbackAnalysis(
        dependencies,
        "Gemini service was temporarily busy; analyzed via deterministic zero-trust threat engine."
      );
      return res.json(fallback);
    }
    res.status(500).json({
      error: error?.message || "Failed to complete Gemini Threat Analysis",
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DepGuard AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
