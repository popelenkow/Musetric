import { createDftBase } from '../src/Sounds/Dft';
import { createFftRadix2Base } from '../src/Sounds/FftRadix2';
import { createFftRadix4Base } from '../src/Sounds/FftRadix4';
import { SpectrometerBase } from '../src/Sounds/Spectrometer';
import { ComplexArray, createComplexArray } from '../src/TypedArray/ComplexArray';

const toStringArray = (input: ArrayLike<number>): string => {
	const arr = Array.from<number>(input).map((x) => (x % 1 ? x.toFixed(2) : x));
	if (arr.length < 9) return `[${arr.join(', ')}]`;
	return `[${arr.slice(0, 6).join(', ')}, ...(${arr.length})]`;
};
const isArrayCloseTo = (arr1: ArrayLike<number>, arr2: ArrayLike<number>): boolean => {
	if (arr1.length !== arr2.length) return false;
	const size = arr1.length;
	for (let i = 0; i < size; i++) {
		if (Number.isNaN(arr1[i]) || Number.isNaN(arr2[i])) return false;
		const diff = arr1[i] - arr2[i];
		if (Math.abs(diff) > 0.00003) return false;
	}
	return true;
};

declare global {
	namespace jest {
		interface Matchers<R> {
			toBeArrayCloseTo(expected: ArrayLike<number>): R,
		}
	}
}
expect.extend({
	toBeArrayCloseTo: (received: ArrayLike<number>, expected: ArrayLike<number>) => {
		const pass = isArrayCloseTo(received, expected);
		return {
			message: () => `${toStringArray(received)} to be close ${toStringArray(expected)}`,
			pass,
		} as const;
	},
});

const testTransform = (createSpectrometer: (windowSize: number) => SpectrometerBase): void => {
	type IO = {
		input: ComplexArray<'float64'>,
		output: ComplexArray<'float64'>,
	};
	const create = (windowSize: number, real: number[], imag: number[]): IO => {
		const input = createComplexArray('float64', windowSize);
		const output = createComplexArray('float64', windowSize);
		for (let i = 0; i < windowSize; i++) {
			input.real[i] = real[i];
			input.imag[i] = imag[i];
		}

		return { input, output };
	};
	const arr: { windowSize: number, inputR: number[], inputI: number[], outputR: number[], outputI: number[] }[] = [
		{ windowSize: 4, inputR: [0, 1, 2, 3], inputI: [0, 0, 0, 0], outputR: [6, -2, -2, -2], outputI: [0, 2, 0, -2] },
		{ windowSize: 4, inputR: [1, 1, 1, 1], inputI: [0, 0, 0, 0], outputR: [4, 0, 0, 0], outputI: [0, 0, 0, 0] },
		{ windowSize: 4, inputR: [1, 0, 0, 0], inputI: [0, 0, 0, 0], outputR: [1, 1, 1, 1], outputI: [0, 0, 0, 0] },
		{ windowSize: 4, inputR: [0, 1, 0, 1], inputI: [0, 0, 0, 0], outputR: [2, 0, -2, 0], outputI: [0, 0, 0, 0] },
		{
			windowSize: 8,
			inputR: [0, 1, 2, 3, 4, 5, 6, 7],
			inputI: [0, 0, 0, 0, 0, 0, 0, 0],
			outputR: [28, -4, -4, -4, -4, -4, -4, -4],
			outputI: [0, 9.656854629516602, 3.999999761581421, 1.6568539142608643, 0, -1.6568541526794434, -3.999999761581421, -9.656853675842285],
		},
		{
			windowSize: 8,
			inputR: [0, 1, 0, 1, 5, 8, 1, 4],
			inputI: [-6, 7, 1, 1, 1, 6, 1, -6],
			outputR: [20, -2.1715729236602783, 22, 3.485280990600586, -8, -7.828427314758301, -13.999999046325684, -13.485280990600586],
			outputI: [5, -3.1715729236602783, -11, 3.3137078285217285, -11, -8.8284273147583, -3.000000238418579, -19.31370735168457],
		},
		{
			windowSize: 32,
			inputR: [6, 2, 5, 1, 5, 7, 4, 2, 5, 1, 2, 3, 5, 6, 7, 9, 1, 3, 5, 4, 4, 6, 1, 4, 3, 7, 8, 3, 1, 5, 8, 2],
			inputI: [5, 0, 8, 2, 2, -1, 6, 3, 5, 6, 2, 5, 1, 5, 7, 4, 2, 5, 9, 1, 3, 5, 4, 4, 6, 7, 8, 3, 1, 5, 8, 2],
			outputR: [135, -14.07465934753418, -1.6564685106277466, -9.712851524353027, -0.12132053077220917, 17.95586395263672, -8.377487182617188, -12.279167175292969, -2.000002384185791, -1.9113843441009521, -12.279922485351561, 13.176605224609375, 2.949747085571289, 8.484329223632811, -11.884305953979492, 17.93377685546875, 5, 16.23209571838379, 22.627031326293945, 8.042764663696289, 4.1213202476501465, 10.931404113769531, -10.93621826171875, 3.7929131984710693, -17.999998092651367, 4.440239429473877, -0.6906391382217407, 18.15033531188965, -6.949746608734131, -10.057887077331543, 15.198012351989746, 8.895622253417969],
			outputI: [133, -0.5500290393829346, 2.7617039680480957, -11.831425666809082, 27.263452529907227, 6.805717468261719, 0.9914737343788147, -10.315613746643066, -36, -10.549412727355957, -10.41460132598877, 17.043987274169922, 18.77817153930664, -11.973822593688965, 10.484029769897461, 25.16956329345703, 21, 6.496326446533203, 14.350992202758789, 0.9441582560539246, -5.263453483581543, 18.01329231262207, -5.8199005126953125, 26.158178329467773, -18.000001907348633, -8.367445945739746, -34.698097229003906, 2.529571771621704, 3.2218289375305176, 8.125374794006348, -9.655603408813477, -9.698420524597168],
		},
		{
			windowSize: 64,
			inputR: [0, 1, 0, 1, 5, 8, 1, 4, 5, -4, 2, 4, 5, 6, 1, 3, 5, 0, 8, 2, 2, 3, 1, 4, 6, 4, 5, 6, -4, 1, 3, 5, 6, 2, 5, 1, 5, 7, 4, 2, 5, 1, 2, 3, 5, 6, 7, 9, 1, 3, 5, 4, 4, 6, 1, 4, 3, 7, 8, 3, 1, 5, 8, 2],
			inputI: [0, 1, 0, 1, 5, 8, 1, 4, 5, -4, 2, 4, 5, 6, 1, 3, 5, 0, 8, 2, 2, -1, 1, 4, 6, 4, -4, 6, 5, 1, 3, 5, 6, 2, 5, 1, 5, 7, 4, 2, 5, 1, 2, 3, 5, 6, 7, 9, 1, 3, 5, 4, 4, 6, 1, 4, 3, 7, 8, 3, 1, 5, 8, 2],
			outputR: [228, -30.70754623413086, -14.559371948242188, -9.393547058105469, -10.029816627502441, -18.725534439086914, -10.40579605102539, -15.779118537902832, -28.769550323486328, -29.117244720458984, 9.776834487915039, -5.056674957275391, -7.695293426513672, -44.182029724121094, -4.161919116973877, -18.096294403076172, -12, 36.288455963134766, 13.102376937866211, 30.04388427734375, -33.031593322753906, 23.368274688720703, 4.575273513793945, -38.04750442504883, -1.8994967937469482, 3.0968689918518066, 36.34109115600586, -1.9708938598632813, -2.029529571533203, 29.167200088500977, -12.131369590759277, -17.759258270263672, 2, 6.877775192260742, 12.215011596679688, -18.613962173461914, 11.586167335510254, -17.2659854888916, -16.173969268798828, 0.04331944137811661, 44.76955032348633, 3.826556921005249, -2.9841275215148926, -26.36020278930664, -27.517908096313477, -14.154828071594238, -24.701078414916992, -21.927404403686523, -2, -0.1877293735742569, -9.586441040039061, -6.95963716506958, 3.475242853164673, 22.204158782958984, 66.0877456665039, -25.99441146850586, 17.89949607849121, -6.077138423919678, -36.30537033081055, -7.747835636138916, 9.242729187011719, 3.588759422302246, -11.088892936706543, 23.619544982910156],
			outputI: [224, 19.589773178100586, -0.6699739694595337, -5.712024211883545, 10.805866241455078, -0.9420346617698669, -47.305301666259766, 5.498403549194336, 5.55634880065918, -11.306914329528809, 51.1859016418457, 30.034265518188477, 10.310460090637207, -29.378625869750977, 20.448711395263672, -26.072254180908203, 12, -23.867992401123047, -30.675439834594727, -3.073995351791382, -44.01957321166992, -4.5727219581604, -25.286325454711914, 18.091426849365234, 44.76955795288086, -12.558175086975098, 0.2886000871658325, -28.653539657592773, 15.359918594360352, -18.928966522216797, 14.28746509552002, 2.1887972354888916, 6, -18.504831314086914, -12.808764457702637, 27.04375648498535, 3.863175630569458, -6.424323081970215, 31.626718521118164, 20.00564956665039, -25.556346893310547, -18.026762008666992, -4.041010856628418, 19.93914794921875, -21.8668155670166, 14.802234649658203, 32.041202545166016, 13.688130378723145, 10, -30.863426208496094, -7.929085731506348, -24.355573654174805, -34.64946746826172, 17.839740753173828, -3.11834716796875, -24.830177307128906, -28.769550323486328, -18.402814865112305, -3.350229263305664, -31.22201919555664, 4.196437358856201, -18.45417022705078, -14.694114685058594, -24.569995880126953],
		},
	];
	describe('forward', () => {
		for (let i = 0; i < arr.length; i++) {
			const { windowSize, inputR, inputI, outputR, outputI } = arr[i];
			it(`${toStringArray(inputR)}, ${toStringArray(inputI)}`, () => {
				const { input, output } = create(windowSize, inputR, inputI);
				createSpectrometer(windowSize).forward(input, output);
				expect(output.real).toBeArrayCloseTo(outputR);
				expect(output.imag).toBeArrayCloseTo(outputI);
			});
		}
	});
	describe('inverse', () => {
		for (let i = 0; i < arr.length; i++) {
			const { windowSize, inputR, inputI, outputR, outputI } = arr[i];
			it(`${toStringArray(outputR)}, ${toStringArray(outputI)}`, () => {
				const { input, output } = create(windowSize, outputR, outputI);
				expect(() => createSpectrometer(windowSize).inverse(input, output)).not.toThrow();
				expect(output.real).toBeArrayCloseTo(inputR);
				expect(output.imag).toBeArrayCloseTo(inputI);
			});
		}
	});
};

describe('dft', () => {
	testTransform(createDftBase);
});

describe('fft2', () => {
	testTransform(createFftRadix2Base);
});

describe('fft4', () => {
	testTransform(createFftRadix4Base);
});
