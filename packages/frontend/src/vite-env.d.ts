/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPECTROGRAM_PROFILING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
