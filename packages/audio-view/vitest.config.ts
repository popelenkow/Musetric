import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const isSkip = process.platform === 'linux';

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
  test: {
    exclude: isSkip ? ['**/*'] : [],
    passWithNoTests: isSkip,
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          args: [
            '--enable-unsafe-webgpu',
            '--disable-webgpu-blocklist',
            '--enable-features=WebGpu',
            '--enable-vulkan',
          ],
        },
      }),
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
});
