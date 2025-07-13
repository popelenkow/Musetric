import { Colors, parseHexColor } from '../../colors';

const toVec4 = (hex: string): [number, number, number, number] => {
  const { red, green, blue } = parseHexColor(hex);
  return [red / 255, green / 255, blue / 255, 1];
};

export const createBuffers = (device: GPUDevice, colorsData: Colors) => {
  const colorsArray = new Float32Array([
    ...toVec4(colorsData.played),
    ...toVec4(colorsData.unplayed),
    ...toVec4(colorsData.background),
  ]);
  const progressArray = new Float32Array([1]);

  const colors = device.createBuffer({
    label: 'drawer-colors-buffer',
    size: colorsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const progress = device.createBuffer({
    label: 'drawer-progress-buffer',
    size: 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(colors, 0, colorsArray);

  const buffers = {
    colors,
    progress,
    writeProgress: (data: number) => {
      progressArray[0] = data;
      device.queue.writeBuffer(progress, 0, progressArray);
    },
    destroy: () => {
      colors.destroy();
      progress.destroy();
    },
  };

  return buffers;
};
export type Buffers = ReturnType<typeof createBuffers>;
