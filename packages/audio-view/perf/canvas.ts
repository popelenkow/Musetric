const getTargetCanvas = (type: 'gpu' | 'cpu'): HTMLCanvasElement => {
  const id = type === 'gpu' ? 'gpu-canvas' : 'cpu-canvas';
  const el = document.getElementById(id);
  if (!el || !(el instanceof HTMLCanvasElement)) {
    throw new Error('Canvas elements not found');
  }
  return el;
};

export const getCanvas = () => ({
  cpu: getTargetCanvas('cpu'),
  gpu: getTargetCanvas('gpu'),
});
