export type Workers = {
    playerUrl: URL | string,
    recorderUrl: URL | string,
    createSpectrumWorker: () => Worker,
};
