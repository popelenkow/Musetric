export type Workers = {
	createSpectrumWorker: () => Worker;
	createWavConverterWorker: () => Worker;
};
