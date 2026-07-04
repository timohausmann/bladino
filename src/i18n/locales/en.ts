import { bundleFromGlob } from './bundleFromGlob';

export default bundleFromGlob(
  import.meta.glob('@/locales/en/*.json', { eager: true, import: 'default' }),
);
