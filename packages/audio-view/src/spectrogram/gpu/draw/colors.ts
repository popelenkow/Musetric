import { parseHexColor, ViewColors } from '../../../common';

const toVec4 = (hex: string): [number, number, number, number] => {
  const { red, green, blue } = parseHexColor(hex);
  return [red / 255, green / 255, blue / 255, 1];
};

export type StateColors = {
  buffer: GPUBuffer;
  write: (value: ViewColors) => void;
  destroy: () => void;
};
export const createColors = (device: GPUDevice): StateColors => {
  const array = new Float32Array(12);
  const buffer = device.createBuffer({
    label: 'draw-colors-buffer',
    size: array.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const ref: StateColors = {
    buffer,
    write: (value: ViewColors) => {
      array.set([
        ...toVec4(value.played),
        ...toVec4(value.unplayed),
        ...toVec4(value.background),
      ]);
      device.queue.writeBuffer(buffer, 0, array);
    },
    destroy: () => {
      buffer.destroy();
    },
  };
  return ref;
};
