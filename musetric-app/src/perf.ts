/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import FFT from 'fft.js';
import Chart, { ChartConfiguration, ChartData, ScatterDataPoint } from 'chart.js/auto';
import { createComplexArray } from 'musetric/Sounds/ComplexArray';
import { createFftRadix2Base } from 'musetric/Sounds/FftRadix2';
import { createFftRadix4Base } from 'musetric/Sounds/FftRadix4';
import { getStorageThemeId } from 'musetric/AppBase/Theme';
import { allThemeEntries } from 'musetric/Resources/Themes';

const add = (dt: number, t1: number, t2: number) => {
	return 0.95 * dt + 0.05 * (t2 - t1);
};

export const run = async (): Promise<void> => {
	const root = document.getElementById('root');
	if (!root) throw new Error();
	const themeId = getStorageThemeId() || 'dark';
	const { theme } = allThemeEntries.find((x) => x.themeId === themeId) || {};
	if (!theme) throw new Error();
	root.style.backgroundColor = theme.app;
	root.style.display = 'flex';
	root.style.flexDirection = 'column';
	root.style.minHeight = `${window.innerHeight}px`;

	type PerfData = {
		windowSize: number;
		fft2R: number;
		fft4R: number;
		fft4O: number;
	};

	let text = '';
	const windowSize = 16384;
	const input = createComplexArray(windowSize, 'float32');
	const output = createComplexArray(windowSize, 'list');
	for (let i = 0; i < windowSize; i++) {
		input.real[i] = 0;
		input.imag[i] = 0;
	}

	const perfAll = (i: number): PerfData => {
		const L = 150;

		let t1: number;
		let t2: number;
		let dt = 0;
		const perf = (task: () => void) => {
			dt = 0;
			for (let j = 0; j < L; j++) {
				t1 = performance.now();
				task();
				t2 = performance.now();
				dt = add(dt, t1, t2);
			}
			return 1000 / dt;
		};

		const fftRadix2 = createFftRadix2Base(i);
		const fft2R = perf(() => fftRadix2.forward(input, output));

		const fftRadix4 = createFftRadix4Base(i);
		const fft4R = perf(() => fftRadix4.forward(input, output));

		const fftRadix4O = new FFT(i);
		const w1 = fftRadix4O.toComplexArray(input.real, null);
		const w2 = fftRadix4O.toComplexArray(output.real, null);
		const fft4O = perf(() => fftRadix4O.transform(w2, w1));

		return { windowSize: i, fft2R, fft4R, fft4O };
	};

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error();
	const getDataset = (arr: PerfData[], key: keyof PerfData): ScatterDataPoint[] => {
		const values: ScatterDataPoint[] = [];
		for (let i = 0; i < arr.length; i++) {
			values.push({ x: arr[i].windowSize, y: arr[i][key] });
		}
		return values;
	};
	const data: ChartData = {
		datasets: [],
	};
	const config: ChartConfiguration = {
		type: 'scatter',
		data,
		options: {
			plugins: {
				legend: {
					display: true,
					labels: {
						color: theme.content,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						color: theme.content,
					},
					grid: {
						color: theme.splitter,
					},
				},
				y: {
					ticks: {
						color: theme.content,
					},
					grid: {
						color: theme.splitter,
					},
				},
			},
		},
	};
	const myChart = new Chart(ctx, config);

	const github = document.createElement('a');
	github.href = 'https://github.com/popelenkow/Musetric';
	github.text = 'github';
	github.style.color = 'rgb(99, 132, 255)';

	const app = document.createElement('a');
	app.href = window.location.origin;
	app.text = 'app';
	app.style.color = 'rgb(99, 132, 255)';

	const links = document.createElement('div');
	links.style.display = 'flex';
	links.style.flexDirection = 'row';
	links.style.flexWrap = 'nowrap';
	links.style.justifyContent = 'space-between';
	links.style.margin = '15px';
	links.appendChild(github);
	links.appendChild(app);

	const textDiv = document.createElement('div');
	textDiv.style.color = theme.content;

	root.innerHTML = '';
	root.appendChild(links);
	root.appendChild(canvas);
	root.appendChild(textDiv);

	const arr: PerfData[] = [];
	const plot = (size: number) => {
		const perfValue = perfAll(size);
		arr.push(perfValue);
		const fft2RData = getDataset(arr, 'fft2R');
		const fft4RData = getDataset(arr, 'fft4R');
		const fft4OData = getDataset(arr, 'fft4O');
		myChart.data.datasets = [{
			label: 'fft Radix2',
			backgroundColor: 'rgb(99, 132, 255)',
			borderColor: 'rgb(99, 132, 255)',
			showLine: true,
			data: fft2RData,
		}, {
			label: 'fft Radix4',
			backgroundColor: 'rgb(99, 255, 132)',
			borderColor: 'rgb(99, 255, 132)',
			showLine: true,
			data: fft4RData,
		}, {
			label: 'fft.js',
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgb(255, 99, 132)',
			showLine: true,
			data: fft4OData,
		}];
		text = arr.map((x) => {
			let value = '';
			value += `forward ${x.windowSize}\n`;
			value += `fft2R ${(x.fft2R).toFixed(0)}\n`;
			value += `fft4R ${(x.fft4R).toFixed(0)}\n`;
			value += `fft4O ${(x.fft4O).toFixed(0)}\n`;
			return value;
		}).join('\n');
		textDiv.innerText = text;
		myChart.update();
	};

	await new Promise<void>((resolve) => {
		setTimeout(() => {
			perfAll(2048);
			perfAll(2048);
			perfAll(4096);
			perfAll(4096);
			resolve();
		}, 0);
	});

	await new Promise<void>((resolve) => {
		setTimeout(() => {
			const sizes = [2048, 4096, 8192, 16384];
			for (let j = 0; j < sizes.length; j++) {
				plot(sizes[j]);
			}
			resolve();
		}, 0);
	});
};

run().finally(() => { });
