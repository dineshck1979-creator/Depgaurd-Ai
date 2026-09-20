import { ExtractedDependency, SupportedLanguage, Ecosystem } from '../types';

// Python Normalization Map (Import Module Name -> Installable PyPI Package Name)
export const PYTHON_NORMALIZATION_MAP: Record<string, string> = {
  PIL: 'Pillow',
  cv2: 'opencv-python',
  sklearn: 'scikit-learn',
  bs4: 'beautifulsoup4',
  yaml: 'PyYAML',
  dateutil: 'python-dateutil',
  git: 'GitPython',
  psycopg2: 'psycopg2-binary',
  serial: 'pyserial',
  jwt: 'PyJWT',
};

// Python Standard Library modules to identify built-ins
export const PYTHON_STANDARD_LIBS = new Set([
  'abc', 'argparse', 'array', 'ast', 'asyncio', 'base64', 'collections', 'concurrent',
  'contextlib', 'copy', 'csv', 'ctypes', 'dataclasses', 'datetime', 'decimal', 'difflib',
  'dis', 'email', 'enum', 'errno', 'faulthandler', 'fcntl', 'fnmatch', 'fractions',
  'functools', 'gc', 'getopt', 'getpass', 'glob', 'gzip', 'hashlib', 'heapq', 'hmac',
  'html', 'http', 'idlelib', 'imaplib', 'importlib', 'inspect', 'io', 'ipaddress',
  'itertools', 'json', 'logging', 'lzma', 'math', 'mimetypes', 'mmap', 'multiprocessing',
  'netrc', 'nntplib', 'numbers', 'operator', 'os', 'pathlib', 'pdb', 'pickle', 'pipes',
  'pkgutil', 'platform', 'plistlib', 'poplib', 'posix', 'pprint', 'profile', 'pstats',
  'queue', 'quopri', 'random', 're', 'readline', 'resource', 'rlcompleter', 'sched',
  'secrets', 'select', 'selectors', 'shelve', 'shlex', 'shutil', 'signal', 'site',
  'smtplib', 'socket', 'socketserver', 'sqlite3', 'ssl', 'stat', 'statistics', 'string',
  'struct', 'subprocess', 'sunau', 'symbol', 'symtable', 'sys', 'sysconfig', 'tabnanny',
  'tarfile', 'telnetlib', 'tempfile', 'test', 'textwrap', 'threading', 'time', 'timeit',
  'tkinter', 'token', 'tokenize', 'trace', 'traceback', 'tracemalloc', 'tty', 'turtle',
  'types', 'typing', 'unicodedata', 'unittest', 'urllib', 'uu', 'uuid', 'venv',
  'warnings', 'wave', 'weakref', 'webbrowser', 'wsgiref', 'xml', 'xmlrpc', 'zipfile',
  'zipimport', 'zlib', 'zoneinfo'
]);

// Node.js Standard Library modules
export const NODE_STANDARD_LIBS = new Set([
  'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console', 'constants',
  'crypto', 'dgram', 'diagnostics_channel', 'dns', 'domain', 'events', 'fs', 'fs/promises',
  'http', 'http2', 'https', 'inspector', 'module', 'net', 'os', 'path', 'path/posix', 'path/win32',
  'perf_hooks', 'process', 'punycode', 'querystring', 'readline', 'readline/promises', 'repl',
  'stream', 'stream/promises', 'stream/web', 'string_decoder', 'test', 'timers', 'timers/promises',
  'tls', 'trace_events', 'tty', 'url', 'util', 'v8', 'vm', 'wasi', 'worker_threads', 'zlib', 'sqlite'
]);

/**
 * Normalizes an import name into its official package distribution name
 */
export function normalizeDependency(importName: string, ecosystem: Ecosystem): { packageName: string; isNormalized: boolean } {
  if (ecosystem === 'PyPI') {
    const normalized = PYTHON_NORMALIZATION_MAP[importName];
    if (normalized) {
      return { packageName: normalized, isNormalized: true };
    }
  }
  return { packageName: importName, isNormalized: false };
}

/**
 * Extracts Python dependencies from source code
 * Supports:
 * - import package
 * - import package.submodule
 * - from package import something
 * - ignores relative imports (e.g., from . import utils, from ..components import foo)
 */
export function extractPythonDependencies(code: string): ExtractedDependency[] {
  const lines = code.split(/\r?\n/);
  const results: ExtractedDependency[] = [];
  const seenPackages = new Set<string>();

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    // Skip empty lines or full comment lines
    if (!line || line.startsWith('#')) {
      return;
    }

    // Strip trailing inline comments for parsing
    const codePart = line.split('#')[0].trim();

    // 1. Check: from <package> import <something>
    // Example: from sklearn.model_selection import train_test_split
    // Example: from bs4 import BeautifulSoup
    // Example: from . import utils (MUST IGNORE)
    const fromImportMatch = codePart.match(/^from\s+([a-zA-Z0-9_.]+)\s+import\s+(.+)$/);
    if (fromImportMatch) {
      const fullModulePath = fromImportMatch[1];
      
      // Ignore relative imports (starts with '.')
      if (fullModulePath.startsWith('.')) {
        return;
      }

      // Root package is the top-level identifier before any dot
      const rootPackage = fullModulePath.split('.')[0];
      if (rootPackage) {
        const isStdLib = PYTHON_STANDARD_LIBS.has(rootPackage);
        const { packageName, isNormalized } = normalizeDependency(rootPackage, 'PyPI');
        const dedupeKey = `${packageName}:${lineNumber}`;

        if (!seenPackages.has(dedupeKey)) {
          seenPackages.add(dedupeKey);
          results.push({
            id: `py-${lineNumber}-${rootPackage}`,
            importName: rootPackage,
            packageName: packageName,
            originalImport: line,
            isNormalized: isNormalized,
            ecosystem: 'PyPI',
            status: isStdLib ? 'REVIEW REQUIRED' : 'UNVERIFIED',
            reviewReason: isStdLib ? 'Built-in Python Standard Library module.' : undefined,
            evidence: {
              lineNumber,
              rawLine,
              statementType: 'from-import',
            },
            isStandardLibrary: isStdLib,
          });
        }
      }
      return;
    }

    // 2. Check: import <package> or import <package.submodule> or import a, b, c
    // Example: import requests
    // Example: import numpy as np
    // Example: import cv2
    // Example: import package.submodule
    const importMatch = codePart.match(/^import\s+([a-zA-Z0-9_.,\s]+)$/);
    if (importMatch) {
      const importsList = importMatch[1].split(',');
      for (const item of importsList) {
        const cleanItem = item.trim();
        if (!cleanItem) continue;

        // Ignore relative imports if any
        if (cleanItem.startsWith('.')) continue;

        // Handle `import pkg as alias`
        const baseName = cleanItem.split(/\s+as\s+/)[0].trim();
        // Handle `import pkg.submodule` -> extracts `pkg`
        const rootPackage = baseName.split('.')[0].trim();

        if (rootPackage && /^[a-zA-Z0-9_]+$/.test(rootPackage)) {
          const isStdLib = PYTHON_STANDARD_LIBS.has(rootPackage);
          const { packageName, isNormalized } = normalizeDependency(rootPackage, 'PyPI');
          const dedupeKey = `${packageName}:${lineNumber}`;

          if (!seenPackages.has(dedupeKey)) {
            seenPackages.add(dedupeKey);
            results.push({
              id: `py-${lineNumber}-${rootPackage}`,
              importName: rootPackage,
              packageName: packageName,
              originalImport: line,
              isNormalized: isNormalized,
              ecosystem: 'PyPI',
              status: isStdLib ? 'REVIEW REQUIRED' : 'UNVERIFIED',
              reviewReason: isStdLib ? 'Built-in Python Standard Library module.' : undefined,
              evidence: {
                lineNumber,
                rawLine,
                statementType: 'import',
              },
              isStandardLibrary: isStdLib,
            });
          }
        }
      }
      return;
    }
  });

  return results;
}

/**
 * Extracts JavaScript / TypeScript dependencies from source code
 * Supports:
 * - import package from "package"
 * - import { a, b } from "package" (including multi-line destructuring)
 * - import * as pkg from "package"
 * - import type { X } from "package"
 * - import "package" (side-effect imports)
 * - require("package") (including inside functions, classes, and callbacks)
 * - await import("package") / dynamic import("package")
 * - export { a } from "package" / export * from "package"
 * - Ignores relative/local imports such as ./utils, ../components, /root, @/, ~/
 */
export function extractJavaScriptDependencies(code: string): ExtractedDependency[] {
  const lines = code.split(/\r?\n/);
  const results: ExtractedDependency[] = [];
  const seenPackages = new Set<string>();

  const isLocalOrRelative = (specifier: string): boolean => {
    const s = specifier.trim();
    return (
      s.startsWith('./') ||
      s.startsWith('../') ||
      s.startsWith('/') ||
      s.startsWith('~/') ||
      s.startsWith('@/') ||
      s.startsWith('.\\') ||
      s.startsWith('..\\')
    );
  };

  const cleanPackageName = (specifier: string): string => {
    let cleaned = specifier.trim();
    // Strip node: protocol prefix if present (e.g. node:fs -> fs)
    if (cleaned.startsWith('node:')) {
      cleaned = cleaned.slice(5);
    }

    // Scoped packages e.g. @google/genai or @google/genai/submodule -> @google/genai
    if (cleaned.startsWith('@')) {
      const parts = cleaned.split('/');
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
      return cleaned;
    }

    // Unscoped packages e.g. lodash/fp -> lodash
    return cleaned.split('/')[0];
  };

  const getLineInfo = (index: number) => {
    const upTo = code.slice(0, index);
    const lineNum = upTo.split(/\r?\n/).length;
    const rawLine = lines[lineNum - 1] || '';
    return { lineNum, rawLine };
  };

  const addPackage = (
    rawSpecifier: string,
    matchIndex: number,
    statementType: 'import' | 'require' | 'dynamic-import' | 'side-effect-import' | 'export-from',
    originalText: string
  ) => {
    if (!rawSpecifier || isLocalOrRelative(rawSpecifier)) return;

    const pkgName = cleanPackageName(rawSpecifier);
    if (!pkgName || pkgName === '.' || pkgName === '..') return;

    const isStdLib = NODE_STANDARD_LIBS.has(pkgName);
    const { lineNum, rawLine } = getLineInfo(matchIndex);
    const dedupeKey = `${pkgName}:${lineNum}`;

    if (!seenPackages.has(dedupeKey)) {
      seenPackages.add(dedupeKey);
      results.push({
        id: `js-${lineNum}-${pkgName}`,
        importName: rawSpecifier,
        packageName: pkgName,
        originalImport: originalText.trim().replace(/\s+/g, ' '),
        isNormalized: false,
        ecosystem: 'npm',
        status: isStdLib ? 'REVIEW REQUIRED' : 'UNVERIFIED',
        reviewReason: isStdLib ? 'Built-in Node.js module.' : undefined,
        evidence: {
          lineNumber: lineNum,
          rawLine: rawLine.trim(),
          statementType,
        },
        isStandardLibrary: isStdLib,
      });
    }
  };

  // 1. Dynamic imports: import("pkg") or await import("pkg") - works inside functions
  const dynamicImportRegex = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = dynamicImportRegex.exec(code)) !== null) {
    addPackage(m[1], m.index, 'dynamic-import', m[0]);
  }

  // 2. CommonJS require: require("pkg") - works at top-level or inside functions
  const requireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  while ((m = requireRegex.exec(code)) !== null) {
    addPackage(m[1], m.index, 'require', m[0]);
  }

  // 3. Static ES Imports with `from`:
  // Handles single-line and multi-line destructured imports:
  // import {
  //   useState,
  //   useEffect
  // } from "react";
  const importFromRegex = /import\s+(?:type\s+)?(?:[\w*\s$,]+|\{[\s\S]*?\})\s+from\s+['"`]([^'"`]+)['"`]/g;
  while ((m = importFromRegex.exec(code)) !== null) {
    addPackage(m[1], m.index, 'import', m[0]);
  }

  // 4. Side-effect direct imports: import "package" or import 'package'
  const sideEffectRegex = /import\s+['"`]([^'"`]+)['"`]/g;
  while ((m = sideEffectRegex.exec(code)) !== null) {
    addPackage(m[1], m.index, 'side-effect-import', m[0]);
  }

  // 5. ES Re-exports: export { x } from "pkg" or export * from "pkg"
  const exportFromRegex = /export\s+(?:[\w*\s$,]+|\{[\s\S]*?\})\s+from\s+['"`]([^'"`]+)['"`]/g;
  while ((m = exportFromRegex.exec(code)) !== null) {
    addPackage(m[1], m.index, 'export-from', m[0]);
  }

  // 6. Line-by-line fallback for loose statements or user prompt variations
  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) return;

    // Match loose: import package_name without quotes
    const looseMatch = line.match(/^import\s+([a-zA-Z0-9@_.-]+);?$/);
    if (looseMatch && !looseMatch[1].startsWith('from')) {
      const lineIndex = code.indexOf(rawLine);
      addPackage(looseMatch[1], lineIndex >= 0 ? lineIndex : 0, 'side-effect-import', line);
    }
  });

  return results.sort((a, b) => a.evidence.lineNumber - b.evidence.lineNumber);
}

/**
 * Universal extractor dispatch
 */
export function extractDependencies(code: string, language: SupportedLanguage): ExtractedDependency[] {
  if (language === 'python') {
    return extractPythonDependencies(code);
  }
  return extractJavaScriptDependencies(code);
}

// Default Examples as explicitly requested
export const PYTHON_EXAMPLE = `# AI-generated Python snippet (Neural Nexus DepGuard Test)
import requests
import numpy as np
import totally_fake_package_928374
from sklearn.model_selection import train_test_split
import cv2
from PIL import Image
import os
from bs4 import BeautifulSoup
from .local_utils import helper_function
`;

export const JAVASCRIPT_EXAMPLE = `// AI-generated JavaScript snippet (Neural Nexus DepGuard Test)
import express from "express";
import axios from "axios";
import {
  useState,
  useEffect
} from "react";
import "totally-fake-package-928374";

// Function with dynamic require and local module
function processData() {
  const lodash = require("lodash");
  return lodash.compact([1, 0, false, 2]);
}

// Subpath & Relative imports
import get from "lodash/get";
import { formatData } from "./utils/helpers";
import ComponentA from "../components/ComponentA";
`;
