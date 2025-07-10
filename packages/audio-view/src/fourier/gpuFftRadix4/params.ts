export const paramsCount = 4;

export type Params = {
  windowSize: number;
  windowCount: number;
  reverseWidth: number;
  inverse: boolean;
};

export const createParams = () => {
  const instance = new Uint32Array(paramsCount);
  return {
    instance,
    set: (params: Params) => {
      instance[0] = params.windowSize;
      instance[1] = params.windowCount;
      instance[2] = params.reverseWidth;
      instance[3] = params.inverse ? 1 : 0;
    },
  };
};
