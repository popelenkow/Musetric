import { useEffect, useState } from 'react';

type GPUInfo = { adapter: GPUAdapter; device: GPUDevice };
const getGPUInfo = async (): Promise<GPUInfo> => {
  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) {
    throw new Error('WebGPU adapter not available');
  }
  const device = await adapter.requestDevice();
  return { adapter, device };
};

let gpuInfo: GPUInfo | undefined;
let promise: Promise<GPUInfo> | undefined;
export const getGpuDevice = async () => {
  promise = promise ?? getGPUInfo();
  gpuInfo = gpuInfo ?? (await promise);
  return gpuInfo.device;
};

export const useGpuDevice = () => {
  const [device, setDevice] = useState<GPUDevice | undefined>(gpuInfo?.device);

  useEffect(() => {
    void getGpuDevice().then(setDevice);
  }, []);

  return device;
};
