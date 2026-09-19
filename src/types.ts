export type SupportedLanguage = 'python' | 'javascript';
export type Ecosystem = 'PyPI' | 'npm';

export type VerificationStatus =
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'REGISTRY UNAVAILABLE'
  | 'REVIEW REQUIRED';

export interface RegistryMetadata {
  exists: boolean;
  latestVersion?: string;
  summary?: string;
  registryUrl?: string;
  projectUrl?: string;
  license?: string;
  author?: string;
  releasedAt?: string;
  checkedAt?: string;
  errorReason?: string;
}

export interface ExtractedDependency {
  id: string;
  importName: string;
  packageName: string;
  originalImport: string;
  isNormalized: boolean;
  ecosystem: Ecosystem;
  status: VerificationStatus;
  reviewReason?: string;
  evidence: {
    lineNumber: number;
    rawLine: string;
    statementType: 'import' | 'from-import' | 'require' | 'side-effect-import';
  };
  isStandardLibrary?: boolean;
  registryMetadata?: RegistryMetadata;
}

export interface SuspiciousSignal {
  package: string;
  severity: 'critical' | 'warning' | 'info';
  signal: string;
  explanation: string;
}

export interface GeminiThreatAnalysis {
  summary: string;
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  verifiedFacts: string[];
  suspiciousSignals: SuspiciousSignal[];
  securityAdvisory: string;
  recommendations: string[];
  analyzedAt: string;
}

export interface ScanResult {
  id: string;
  language: SupportedLanguage;
  code: string;
  timestamp: string;
  totalLines: number;
  dependencies: ExtractedDependency[];
  uniquePackagesCount: number;
  verifiedCount: number;
  unverifiedCount: number;
  reviewRequiredCount: number;
  registryUnavailableCount: number;
  threatAnalysis?: GeminiThreatAnalysis;
}

export type NavTab = 'dashboard' | 'scanner' | 'how-it-works' | 'security';

