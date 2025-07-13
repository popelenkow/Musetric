import { useEffect, useState } from 'react';

type GPUInfo = { adapter: GPUAdapter; device: GPUDevice };
const getGPUInfo = async (profiling: boolean): Promise<GPUInfo> => {
  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) {
    throw new Error('WebGPU adapter not available');
  }
  const device = await adapter.requestDevice({
    requiredFeatures: profiling ? ['timestamp-query'] : undefined,
  });
  return { adapter, device };
};

let gpuInfo: GPUInfo | undefined;
let promise: Promise<GPUInfo> | undefined;
export const getGpuDevice = async (profiling: boolean) => {
  promise = promise ?? getGPUInfo(profiling);
  gpuInfo = gpuInfo ?? (await promise);
  return gpuInfo.device;
};

export const useGpuDevice = (profiling: boolean) => {
  const [device, setDevice] = useState<GPUDevice | undefined>(gpuInfo?.device);

  useEffect(() => {
    void getGpuDevice(profiling).then(setDevice);
  }, [profiling]);

  return device;
};
