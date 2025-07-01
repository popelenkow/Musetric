/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from 'vitest/config';

const isSkip = process.platform === 'linux';

export default defineConfig({
  test: {
    exclude: isSkip ? ['**/*'] : [],
    passWithNoTests: isSkip,
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
          launch: {
            args: [
              '--enable-unsafe-webgpu',
              '--disable-webgpu-blocklist',
              '--enable-features=WebGpu',
              '--enable-vulkan',
            ],
          },
        },
      ],
    },
  },
});
