import { Ecosystem, ExtractedDependency, RegistryMetadata, VerificationStatus } from '../types';

// In-memory cache for registry lookups during a session
const registryCache = new Map<string, RegistryMetadata>();

/**
 * Queries the public PyPI JSON API: https://pypi.org/pypi/<package>/json
 * PyPI provides full CORS (Access-Control-Allow-Origin: *) on this public endpoint.
 */
async function queryPyPI(packageName: string): Promise<RegistryMetadata> {
  const cacheKey = `pypi:${packageName.toLowerCase()}`;
  if (registryCache.has(cacheKey)) {
    return registryCache.get(cacheKey)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const registryUrl = `https://pypi.org/project/${encodeURIComponent(packageName)}/`;

  try {
    const response = await fetch(`https://pypi.org/pypi/${encodeURIComponent(packageName)}/json`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 200) {
      const data = await response.json();
      const info = data?.info || {};

      const metadata: RegistryMetadata = {
        exists: true,
        latestVersion: info.version || 'unknown',
        summary: info.summary || '',
        registryUrl: info.project_url || info.package_url || registryUrl,
        projectUrl:
          info.home_page ||
          info.project_urls?.Homepage ||
          info.project_urls?.['Source Code'] ||
          info.project_urls?.Repository ||
          registryUrl,
        license: info.license || 'Not specified',
        author: info.author || info.maintainer || 'Community',
        checkedAt: new Date().toISOString(),
      };

      registryCache.set(cacheKey, metadata);
      return metadata;
    }

    if (response.status === 404) {
      const metadata: RegistryMetadata = {
        exists: false,
        registryUrl,
        errorReason: 'Package not found in PyPI registry (HTTP 404)',
        checkedAt: new Date().toISOString(),
      };
      registryCache.set(cacheKey, metadata);
      return metadata;
    }

    // Any other HTTP code (500, 503, 429, etc.)
    return {
      exists: false,
      registryUrl,
      errorReason: `PyPI returned HTTP ${response.status}: ${response.statusText}`,
      checkedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMsg =
      err instanceof Error
        ? err.name === 'AbortError'
          ? 'PyPI request timed out after 8 seconds'
          : err.message
        : 'Network connection error';

    return {
      exists: false,
      registryUrl,
      errorReason: errorMsg,
      checkedAt: new Date().toISOString(),
    };
  }
}

/**
 * Queries the public npm registry API: https://registry.npmjs.org/<package>
 * npm provides full CORS (Access-Control-Allow-Origin: *) on this public endpoint.
 */
async function queryNPM(packageName: string): Promise<RegistryMetadata> {
  const cacheKey = `npm:${packageName.toLowerCase()}`;
  if (registryCache.has(cacheKey)) {
    return registryCache.get(cacheKey)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const registryUrl = `https://www.npmjs.com/package/${encodeURIComponent(packageName)}`;

  try {
    // Handle scoped packages correctly: @scope/pkg -> @scope%2Fpkg
    const encodedPackageName = packageName.startsWith('@')
      ? `@${encodeURIComponent(packageName.slice(1))}`
      : encodeURIComponent(packageName);

    const response = await fetch(`https://registry.npmjs.org/${encodedPackageName}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 200) {
      const data = await response.json();
      const latestVersion =
        data?.['dist-tags']?.latest ||
        (data?.versions ? Object.keys(data.versions).pop() : 'unknown');

      const metadata: RegistryMetadata = {
        exists: true,
        latestVersion,
        summary: data?.description || '',
        registryUrl,
        projectUrl: data?.homepage || (typeof data?.repository === 'string' ? data.repository : data?.repository?.url) || registryUrl,
        license: typeof data?.license === 'string' ? data.license : data?.license?.type || 'Not specified',
        author: typeof data?.author === 'string' ? data.author : data?.author?.name || 'Community',
        checkedAt: new Date().toISOString(),
      };

      registryCache.set(cacheKey, metadata);
      return metadata;
    }

    if (response.status === 404) {
      const metadata: RegistryMetadata = {
        exists: false,
        registryUrl,
        errorReason: 'Package not found in npm registry (HTTP 404)',
        checkedAt: new Date().toISOString(),
      };
      registryCache.set(cacheKey, metadata);
      return metadata;
    }

    return {
      exists: false,
      registryUrl,
      errorReason: `npm returned HTTP ${response.status}: ${response.statusText}`,
      checkedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMsg =
      err instanceof Error
        ? err.name === 'AbortError'
          ? 'npm registry request timed out after 8 seconds'
          : err.message
        : 'Network connection error';

    return {
      exists: false,
      registryUrl,
      errorReason: errorMsg,
      checkedAt: new Date().toISOString(),
    };
  }
}

/**
 * Queries public registry for a single dependency and returns its verified state
 */
export async function verifySingleDependency(
  dep: ExtractedDependency
): Promise<ExtractedDependency> {
  // If it's a built-in standard library module (e.g. os, sys, fs, path),
  // standard libraries are built-in and shouldn't be installed from PyPI/npm.
  if (dep.isStandardLibrary) {
    return {
      ...dep,
      status: 'REVIEW REQUIRED',
      reviewReason:
        dep.ecosystem === 'PyPI'
          ? `'${dep.packageName}' is a Python built-in standard library module. It does not need to be installed via pip.`
          : `'${dep.packageName}' is a built-in Node.js module. It does not need to be installed via npm.`,
      registryMetadata: {
        exists: true,
        latestVersion: 'Built-in (System)',
        summary: 'Official standard library module included with the language runtime.',
        registryUrl:
          dep.ecosystem === 'PyPI'
            ? `https://docs.python.org/3/library/${dep.packageName}.html`
            : `https://nodejs.org/api/${dep.packageName}.html`,
        checkedAt: new Date().toISOString(),
      },
    };
  }

  // Real registry query
  const metadata =
    dep.ecosystem === 'PyPI'
      ? await queryPyPI(dep.packageName)
      : await queryNPM(dep.packageName);

  // Evaluate verification status based on real registry response
  let status: VerificationStatus;
  let reviewReason: string | undefined;

  if (metadata.exists) {
    if (dep.isNormalized) {
      status = 'REVIEW REQUIRED';
      reviewReason = `Package verified on ${dep.ecosystem} as '${dep.packageName}', but was imported in code as '${dep.importName}'. Review normalization before installing.`;
    } else {
      status = 'VERIFIED';
    }
  } else if (metadata.errorReason?.includes('HTTP 404') || metadata.errorReason?.includes('not found')) {
    status = 'UNVERIFIED';
    reviewReason = `Package '${dep.packageName}' does not exist in the official public ${dep.ecosystem} registry. Potential hallucination or unregistered package name.`;
  } else {
    // Registry was unreachable, timed out, or network error
    status = 'REGISTRY UNAVAILABLE';
    reviewReason = metadata.errorReason || `Failed to communicate with ${dep.ecosystem} registry API.`;
  }

  return {
    ...dep,
    status,
    reviewReason,
    registryMetadata: metadata,
  };
}

/**
 * Verifies an array of extracted dependencies against PyPI and npm concurrently.
 * Handled gracefully so that network failures or individual timeouts do not crash the scan.
 */
export async function verifyAllDependencies(
  dependencies: ExtractedDependency[]
): Promise<ExtractedDependency[]> {
  const verificationPromises = dependencies.map((dep) =>
    verifySingleDependency(dep).catch((err) => {
      // Fallback in case of unexpected unhandled promise rejection
      return {
        ...dep,
        status: 'REGISTRY UNAVAILABLE' as VerificationStatus,
        reviewReason: err instanceof Error ? err.message : 'Unknown verification error',
        registryMetadata: {
          exists: false,
          errorReason: err instanceof Error ? err.message : 'Unknown verification error',
          checkedAt: new Date().toISOString(),
        },
      };
    })
  );

  return Promise.all(verificationPromises);
}

/**
 * Clears the in-memory cache to allow fresh registry fetches
 */
export function clearRegistryCache(): void {
  registryCache.clear();
}
