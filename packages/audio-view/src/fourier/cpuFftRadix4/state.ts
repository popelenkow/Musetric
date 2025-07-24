import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { utilsRadix4 } from '../utilsRadix4';

export type State = {
  windowSize: number;
  reverseWidth: number;
  reverseTable: Uint32Array;
  trigTable: Float32Array;
  configure: (windowSize: number) => void;
};
export const createState = (): State => {
  const state: State = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    windowSize: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    reverseWidth: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    reverseTable: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    trigTable: undefined!,
    configure: (windowSize) => {
      assertWindowSizePowerOfTwo(windowSize);

      state.windowSize = windowSize;
      state.reverseWidth = utilsRadix4.getReverseWidth(windowSize);
      state.reverseTable = utilsRadix4.createReverseTable(state.reverseWidth);
      state.trigTable = utilsRadix4.createTrigTable(windowSize);
    },
  };

  return state;
};
