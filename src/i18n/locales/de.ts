import { bundleFromGlob } from './bundleFromGlob';

export default bundleFromGlob(
  import.meta.glob('@/locales/de/*.json', { eager: true, import: 'default' }),
);
