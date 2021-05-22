/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import benchmark from 'benchmark';
import {
	drawWaveform, analyzeWaveform, AnalyzeWaveformResult,
	Layout2D, Size2D, allColorThemes,
} from '../src';

export const performanceWaveform = () => {
	const suite = new benchmark.Suite();
	const run = (width: number, height: number, sec: number) => {
		const frame: Size2D = {
			width,
			height,
		};
		const layout: Layout2D = {
			frame,
			view: frame,
			position: { x: 0, y: 0 },
		};
		const output = new Uint8ClampedArray(frame.width * frame.height);
		const input = new Float32Array(44000 * sec);
		const analysis: AnalyzeWaveformResult = {
			minArray: new Float32Array(frame.height),
			maxArray: new Float32Array(frame.height),
		};
		suite.add(`drawWaveform [${frame.width}x${frame.height}] sec ${sec}`, () => {
			analyzeWaveform(input, analysis, layout);
			drawWaveform(analysis, output, layout, allColorThemes.white);
		});
	};
	const runSec = () => {
		const width = 600;
		const height = 600;
		for (let sec = 10; sec <= 60; sec += 10) {
			run(width, height, sec);
		}
	};
	const runWidth = () => {
		const height = 600;
		const sec = 40;
		for (let width = 400; width <= 800; width += 200) {
			run(width, height, sec);
		}
	};
	const runHeight = () => {
		const width = 600;
		const sec = 40;
		for (let height = 400; height <= 800; height += 200) {
			run(width, height, sec);
		}
	};
	runSec();
	runWidth;
	runHeight;
	suite.on('cycle', (event: any) => {
		console.log(String(event.target));
	});
	suite.on('complete', (ev: any) => {
		ev;
	});
	suite.run({ async: false });
};
