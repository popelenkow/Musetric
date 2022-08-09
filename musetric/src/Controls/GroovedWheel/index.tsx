import React, { useCallback, useEffect, useMemo, useRef, MutableRefObject, ReactElement } from 'react';
import { createInertia } from './Inertia';
import { subscribeInertia } from './SubscribeInertia';
import { Position2D, Size2D, Layout2D, Direction2D } from '../../Rendering/Layout';
import { GroovedWheelColors, drawGroovedWheel } from './Rendering';
import { PixelCanvas, PixelCanvasProps } from '../PixelCanvas';

export type GroovedWheelProps = {
	onMove: (delta: number) => void,
	onActive: (value: boolean) => void,
	stopRef: MutableRefObject<(() => void) | null>,
	contentColor: number,
};
export function GroovedWheel(props: GroovedWheelProps): ReactElement {
	const { onMove, onActive, stopRef, contentColor } = props;
	const ref = useRef<HTMLDivElement>(null);

	const layout = useMemo<Layout2D>(() => {
		const size: Size2D = { width: 1000, height: 100 };
		const direction: Direction2D = { rotation: 'none', reflection: false };
		return { size, direction };
	}, []);
	const shift = useRef(0);
	const draw = useCallback((output: ImageData) => {
		const colors: GroovedWheelColors = {
			background: 0,
			content: contentColor,
		};
		drawGroovedWheel(Math.floor(shift.current), output.data, layout.size, colors);
	}, [layout, contentColor]);
	useEffect(() => {
		if (!ref.current) return undefined;
		const root = ref.current;
		const inertia = createInertia({
			resistance: 2.5,
			friction: 200,
			sampleCount: 3,
		});
		stopRef.current = () => inertia.stop();
		const move = (delta: Position2D) => {
			const realWidth = Number.parseFloat(window.getComputedStyle(root).width);
			const dx = -delta.x;
			shift.current += dx * (layout.size.width / realWidth);
			const count = Math.floor(shift.current / layout.size.width);
			shift.current -= count * layout.size.width;
			onMove(dx);
		};
		const unsubscribe = subscribeInertia({
			inertia,
			element: root,
			onMove: move,
			onActive,
		});
		return () => unsubscribe();
	}, [layout, onMove, onActive, stopRef]);

	const pixelCanvasProps: PixelCanvasProps = {
		layout,
		draw,
	};
	return (
		<div ref={ref} style={{ width: '100%', height: '100%' }}>
			<PixelCanvas {...pixelCanvasProps} />
		</div>
	);
}
