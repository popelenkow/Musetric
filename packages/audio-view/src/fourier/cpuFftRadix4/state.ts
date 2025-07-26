import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { utilsRadix4 } from '../utilsRadix4';

export type State = {
  windowSize: number;
  windowCount: number;
  reverseWidth: number;
  reverseTable: Uint32Array;
  trigTable: Float32Array;
  configure: (windowSize: number, windowCount: number) => void;
};
export const createState = (): State => {
  const ref: State = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    windowSize: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    windowCount: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    reverseWidth: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    reverseTable: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    trigTable: undefined!,
    configure: (windowSize, windowCount) => {
      assertWindowSizePowerOfTwo(windowSize);

      ref.windowSize = windowSize;
      ref.windowCount = windowCount;
      ref.reverseWidth = utilsRadix4.getReverseWidth(windowSize);
      ref.reverseTable = utilsRadix4.createReverseTable(ref.reverseWidth);
      ref.trigTable = utilsRadix4.createTrigTable(windowSize);
    },
  };
  return ref;
};
