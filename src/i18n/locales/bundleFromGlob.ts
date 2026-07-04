import type { LanguageBundles } from '../loadLanguageBundles';

/** Maps Vite glob results (`…/common.json`) to i18next namespace bundles. */
export function bundleFromGlob(
  modules: Record<string, object>,
): LanguageBundles {
  const bundles: LanguageBundles = {};

  for (const [path, content] of Object.entries(modules)) {
    const namespace = path.match(/\/([^/]+)\.json$/)?.[1];
    if (namespace) bundles[namespace] = content;
  }

  return bundles;
}
