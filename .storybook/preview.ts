import type { Preview } from '@storybook/react-vite';
import '../src/tailwind.css';
import { initI18n } from '../src/i18n';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Preview theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  loaders: [
    async () => {
      await initI18n();
      return {};
    },
  ],
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.classList.remove('dark-transparent');

      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Design System', 'UI', 'Post'],
      },
    },
  },
};

export default preview;
