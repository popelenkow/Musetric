export type StateTexture = {
  instance: GPUTexture;
  view: GPUTextureView;
  resize: (width: number, height: number) => void;
  destroy: () => void;
};

export const createTexture = (device: GPUDevice) => {
  const ref: StateTexture = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    instance: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    view: undefined!,
    resize: (width, height) => {
      ref.instance?.destroy();
      ref.instance = device.createTexture({
        label: 'draw-texture',
        size: { width, height },
        format: 'rgba8unorm',
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.STORAGE_BINDING,
      });
      ref.view = ref.instance.createView({
        label: 'draw-texture-view',
      });
    },
    destroy: () => {
      ref.instance?.destroy();
    },
  };
  return ref;
};
