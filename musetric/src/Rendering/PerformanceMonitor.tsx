/* eslint-disable max-len */
import React, { useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { createUseStyles } from 'react-jss';
import { theming } from '../Contexts';

export const getPerformanceMonitorStyles = () => ({
	root: {
		position: 'absolute',
		top: '0',
		right: '0',
	},
});

export const usePerformanceMonitorStyles = createUseStyles(getPerformanceMonitorStyles(), { name: 'PerformanceMonitor', theming });

/** Based on https://github.com/mrdoob/stats.js */

declare	const performance: Window['performance'] & {
	memory?: {
		/** The maximum size of the heap, in bytes, that is available to the context. */
		jsHeapSizeLimit: number;
		/** The total allocated heap size, in bytes. */
		totalJSHeapSize: number;
		/** The currently active segment of JS heap, in bytes. */
		usedJSHeapSize: number;
	};
};

const createStats = () => {
	const createPanel = (name: string, fg: string, bg: string) => {
		let min = Infinity;
		let max = 0;
		const PR = Math.round(window.devicePixelRatio || 1);

		const WIDTH = 80 * PR;
		const HEIGHT = 48 * PR;
		const TEXT_X = 3 * PR;
		const TEXT_Y = 2 * PR;
		const GRAPH_X = 3 * PR;
		const GRAPH_Y = 15 * PR;
		const GRAPH_WIDTH = 74 * PR;
		const GRAPH_HEIGHT = 30 * PR;

		const canvas = document.createElement('canvas');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		canvas.style.cssText = 'width:80px;height:48px';

		const context = canvas.getContext('2d')!;
		context.font = `bold ${9 * PR}px Helvetica,Arial,sans-serif`;
		context.textBaseline = 'top';

		context.fillStyle = bg;
		context.fillRect(0, 0, WIDTH, HEIGHT);

		context.fillStyle = fg;
		context.fillText(name, TEXT_X, TEXT_Y);
		context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

		context.fillStyle = bg;
		context.globalAlpha = 0.9;
		context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

		return {

			dom: canvas,

			update: (value: number, maxValue: number) => {
				min = Math.min(min, value);
				max = Math.max(max, value);

				context.fillStyle = bg;
				context.globalAlpha = 1;
				context.fillRect(0, 0, WIDTH, GRAPH_Y);
				context.fillStyle = fg;
				context.fillText(`${Math.round(value)} ${name} (${Math.round(min)}-${Math.round(max)})`, TEXT_X, TEXT_Y);

				context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

				context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

				context.fillStyle = bg;
				context.globalAlpha = 0.9;
				context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, Math.round((1 - (value / maxValue)) * GRAPH_HEIGHT));
			},
		};
	};
	type Panel = ReturnType<typeof createPanel>;

	let mode = 0;

	const container = document.createElement('div');
	container.style.cssText = 'position:relative;top:0;left:0;cursor:pointer;opacity:0.9;z-index:100';

	const showPanel = (id: number) => {
		for (let i = 0; i < container.children.length; i++) {
			const element = container.children[i] as HTMLElement;
			element.style.display = i === id ? 'block' : 'none';
		}
		mode = id;
	};

	container.addEventListener('click', (event) => {
		event.preventDefault();
		showPanel(++mode % container.children.length);
	}, false);

	const addPanel = (panel: Panel) => {
		container.appendChild(panel.dom);
		return panel;
	};

	let beginTime = (performance || Date).now();
	let prevTime = beginTime;
	let frames = 0;

	const fpsPanel = addPanel(createPanel('FPS', '#0ff', '#002'));
	const msPanel = addPanel(createPanel('MS', '#0f0', '#020'));

	let memPanel: Panel;
	if (performance.memory) {
		memPanel = addPanel(createPanel('MB', '#f08', '#201'));
	}

	showPanel(0);

	const result = {
		dom: container,

		addPanel,
		showPanel,

		begin: () => {
			beginTime = (performance || Date).now();
		},

		end: () => {
			frames++;
			const time = (performance || Date).now();
			msPanel.update(time - beginTime, 200);
			if (time >= prevTime + 1000) {
				fpsPanel.update((frames * 1000) / (time - prevTime), 100);
				prevTime = time;
				frames = 0;

				if (memPanel && performance.memory) {
					const { memory } = performance;
					memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
				}
			}
			return time;
		},

		update: () => {
			beginTime = result.end();
		},

		domElement: container,
		setMode: showPanel,
	};
	return result;
};

export type PerformanceMonitorProps = {
	initViewId?: string;
};

export type PerformanceMonitorRef = {
	begin: () => void;
	end: () => void;
};

export const PerformanceMonitor = forwardRef<PerformanceMonitorRef, PerformanceMonitorProps>((_, ref) => {
	const root = useRef<HTMLDivElement>(null);
	const stats = useMemo(() => createStats(), []);

	const classes = usePerformanceMonitorStyles();

	useImperativeHandle(ref, () => ({
		begin: () => {
			stats.begin();
		},
		end: () => {
			stats.end();
		},
	}));

	useEffect(() => {
		if (root.current) {
			root.current.appendChild(stats.dom);
		}
	}, [stats]);

	return (
		<div className={classes.root} ref={root} />
	);
});
