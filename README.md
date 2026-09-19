# DepGuard AI — Pre-Installation Dependency Verification Tool

**Team Neural Nexus — Hackathon 2026**

DepGuard AI is an automated cybersecurity defense tool specifically engineered for **AI-generated Python and JavaScript code**. It protects developers and engineering teams from AI package hallucinations, slopsquatting, and typosquatting attacks **before** dangerous terminal commands like `pip install` or `npm install` are executed.

---

## 🛡️ The Core Problem: AI Package Hallucinations & Supply Chain Attacks

Large Language Models (ChatGPT, Claude, GitHub Copilot, Gemini) routinely generate syntactically convincing code containing non-existent or fabricated package dependencies (e.g. `totally_fake_package_928374` or `flask-oauth-secure`).

1. **Hallucination & Slopsquatting**: Adversaries continuously scrape public AI prompts, discover recurring hallucinated package names, and register them on PyPI and npm.
2. **Install-Time Code Execution**: Simply running `pip install <package>` executes arbitrary code in `setup.py`. In Node.js, `npm install <package>` automatically executes `preinstall` and `postinstall` shell hooks with full user privileges.
3. **The Solution**: DepGuard AI acts as a pre-install verification gate, statically extracting dependencies, querying authoritative registries in real time, running Gemini supply chain risk analysis on the evidence, and isolating unverified packages before any terminal command runs.

---

## 🔒 The 6 Enforced Security Boundaries

DepGuard AI enforces strict zero-trust operational boundaries across all environments:

1. **No Code Execution**: Submitted Python or JavaScript snippets are never executed, evaluated, or run in any container, VM, or runtime. Parsing operates 100% statically via tokenization and AST inspection.
2. **No `pip install`**: The system never executes `pip`, wheel builds, or `setup.py` hooks. Malicious install scripts cannot trigger.
3. **No `npm install`**: The system never executes `npm`, `npx`, `yarn`, or `pnpm`. Malicious `package.json` install scripts cannot trigger.
4. **No Automatic Package Installation**: DepGuard AI never automatically downloads, caches, or installs packages in the background.
5. **Registry Metadata Is Evidence, Not a Safety Guarantee**: Proving a package exists on PyPI or npm proves only that the name is registered. It **does not** guarantee that the source code is benign, vetted, or free of vulnerabilities. Registry data is technical evidence to inform developer judgment.
6. **Developer Makes the Final Decision**: DepGuard AI provides transparent, verifiable evidence and AI threat signals. The human developer retains complete sovereignty over whether to install.

---

## 🔄 End-to-End Verification Workflow

The verification pipeline consists of 6 sequential stages:

```
[ 1. Extract ] ➔ [ 2. Normalize ] ➔ [ 3. Verify ] ➔ [ 4. Analyze ] ➔ [ 5. Explain ] ➔ [ 6. Developer Decides ]
```

1. **Extract**: Pure static AST and regex extraction of third-party dependencies from Python (`import`, `from ... import`) and JavaScript (`import ... from`, `require()`, scoped `@scope/pkg`). Relative paths (`./`, `../`) and standard library modules (`os`, `sys`, `path`, `fs`) are classified and filtered.
2. **Normalize**: Maps module import names to their official upstream package distribution names (e.g., `PIL` → `Pillow`, `cv2` → `opencv-python`, `sklearn` → `scikit-learn`, `bs4` → `beautifulsoup4`).
3. **Verify**: Queries authoritative public registry endpoints in real time:
   - **PyPI (Python)**: `https://pypi.org/pypi/<package>/json`
   - **npm (JavaScript)**: `https://registry.npmjs.org/<package>`
4. **Analyze**: Evaluates supply chain threat signals with **Gemini 3.8 Flash** via a server-side route. **Zero user source code is transmitted**; only verified registry evidence is passed.
5. **Explain**: Generates a plain-language executive summary, highlights verified registry facts vs. AI threat signals, and flags hallucination or slopsquatting risks.
6. **Developer Decides**: Human-in-the-loop governance. Generates terminal installation commands containing **only confirmed `VERIFIED` packages** via the "Copy Verified Packages Only" action.

---

## 🚦 Verification Status Definitions

- **`VERIFIED`**: Package confirmed to exist on the official upstream registry (HTTP 200). Live version, license, author, official registry link, and package summary are retrieved.
- **`UNVERIFIED`**: Package was not found on the registry (HTTP 404). In AI-generated code, this is a prime indicator of an LLM hallucination or an unregistered name vulnerable to slopsquatting.
- **`REVIEW REQUIRED`**: Package exists but normalization was applied (e.g. `PIL` → `Pillow`), or the import is a built-in standard library module (`os`, `fs`) that does not require package installation.
- **`REGISTRY UNAVAILABLE`**: Upstream registry request failed or timed out due to network latency. Allows per-package retry.

---

## 🧠 Gemini Threat Analysis Architecture

- **Server-Side Only**: The Gemini API key (`GEMINI_API_KEY`) is stored exclusively server-side in environment variables and is never exposed in client bundles or network requests.
- **Source Code Privacy**: The frontend sends **only** the structured dependency evidence payload (package names, import statements, HTTP statuses, and registry metadata) to `/api/threat-analysis`. User code is never sent.
- **Structured Schema**: Gemini returns a strictly typed JSON payload containing:
  - `overallRisk`: `Low` | `Medium` | `High` | `Critical`
  - `summary`: Plain-language developer explanation
  - `verifiedFacts`: Immutable evidence confirmed by upstream registries
  - `suspiciousSignals`: Risk vectors (nonexistent packages, normalization caveats, built-in warnings) with severity levels
  - `securityAdvisory`: Explicit zero-trust limitation notice
  - `recommendations`: Actionable steps for developers
- **Deterministic Heuristic Fallback**: If `GEMINI_API_KEY` is not configured in local development, the backend automatically falls back to a deterministic rule-based threat engine so reviewers can test the complete UX without external dependencies.

---

## 🧪 Built-in Test Demos

The application includes pre-configured test suites accessible directly in the Scanner UI:

### Python Test Suite (`Load Python Demo`)
```python
import requests
import numpy as np
import totally_fake_package_928374
from sklearn.model_selection import train_test_split
import cv2
from PIL import Image
import os
from bs4 import BeautifulSoup
from .local_utils import helper_function
```
**Expected Verification Results**:
- `requests`, `numpy`: **`VERIFIED`** (HTTP 200 on PyPI, version and homepage displayed)
- `totally_fake_package_928374`: **`UNVERIFIED`** (HTTP 404 on PyPI — Hallucination / Slopsquatting risk)
- `sklearn`, `cv2`, `PIL`, `bs4`: **`REVIEW REQUIRED`** (Normalized to `scikit-learn`, `opencv-python`, `Pillow`, `beautifulsoup4`)
- `os`: **`REVIEW REQUIRED`** (Python Standard Library built-in)
- `.local_utils`: Filtered out (Local relative path)

### JavaScript Test Suite (`Load JavaScript Demo`)
```javascript
import express from "express";
import axios from "axios";
import "totally-fake-package-928374";
const lodash = require("lodash");
import { useState, useEffect } from "react";
import { formatData } from "./utils/helpers";
import ComponentA from "../components/ComponentA";
```
**Expected Verification Results**:
- `express`, `axios`, `lodash`, `react`: **`VERIFIED`** (HTTP 200 on npm)
- `totally-fake-package-928374`: **`UNVERIFIED`** (HTTP 404 on npm)
- `./utils/helpers`, `../components/ComponentA`: Filtered out (Local relative paths)

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# 1. Clone repository and install dependencies
git clone https://github.com/neural-nexus/depguard-ai.git
cd depguard-ai
npm install

# 2. Configure environment variables (optional for local Gemini testing)
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
# If left unset, the deterministic heuristic engine handles threat analysis seamlessly.

# 3. Start development server
npm run dev
# Server boots at http://localhost:3000
```

---

## 🔑 Environment Variables Setup

Create a `.env` file in the project root:

```env
# Server-side Gemini API key (never exposed to client)
GEMINI_API_KEY="your-gemini-api-key-here"

# Optional App URL for Cloud deployment
APP_URL="http://localhost:3000"
```

In Google AI Studio, `GEMINI_API_KEY` is automatically managed via the Settings/Secrets panel.

---

## 🚀 Vercel Deployment Steps

DepGuard AI is fully Vercel-ready with zero additional configuration required:

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com):
   - Click **"Add New Project"** and import the repository.
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Under **Environment Variables**:
   - Add `GEMINI_API_KEY` with your Google Gemini API key.
4. Click **Deploy**. Vercel will deploy:
   - The static frontend from `dist/`
   - The serverless API endpoint from `api/threat-analysis.ts`

---

## ⚠️ Important Limitation

**Registry Existence Does NOT Guarantee Package Safety**

Verifying that a package exists on PyPI or npm proves only that the distribution name is claimed and published. It does **not** guarantee that the package code is benign, auditable, or free of vulnerabilities. Threat actors frequently compromise legitimate developer accounts or publish malicious packages under authentic-looking names. Always inspect package release notes, verify repository provenance, and review licenses before installation.
