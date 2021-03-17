/* eslint-disable */

import benchmark from 'benchmark';
import { drawWaveform, Layout2D, Size2D, allColorThemes } from '../src';

export const performanceWaveform = () => {
	const frame: Size2D = {
		width: 1200,
		height: 800,
	}
	const layout: Layout2D = {
		frame,
		view: frame,
		position: { x: 0, y: 0 },
		colorTheme: allColorThemes.white
	}
	const output = new Uint8ClampedArray(frame.width * frame.height);


	const suite = new benchmark.Suite();
	for (let i = 10; i <= 60; i+=10) {
		const input = new Float32Array(44000 * i);
		suite.add(`drawWaveform ${i}`, () => {
			drawWaveform(input, output, 0, layout)
		});
	}
	suite.on('cycle', (event: any) => {
		console.log(String(event.target));
	});
	suite.on('complete', (ev: any) => {
		ev;
	});
	suite.run({ async: false });
}