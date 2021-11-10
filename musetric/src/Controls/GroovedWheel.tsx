import React, { FC, useCallback, useEffect, useMemo, useRef, MutableRefObject } from 'react';
import { startAnimation } from '../Rendering/Animation';
import { createInertia, Inertia } from '../Rendering/Inertia';
import { Position2D, Size2D, Layout2D, Direction2D } from '../Rendering/Layout';
import { GroovedWheelColors, drawGroovedWheel } from '../Rendering/GroovedWheel';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';

const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
	return event instanceof TouchEvent;
};

const getClientPosition = (event: MouseEvent | TouchEvent) => {
	const { clientX, clientY } = isTouchEvent(event) ? event.touches[0] : event;
	return { clientX, clientY };
};

export type InertialDragOptions = {
	inertia: Inertia;
	element: HTMLElement;
	onMove: (delta: Position2D) => void;
	onActive: (value: boolean) => void;
};
export const subscribeInertia = (options: InertialDragOptions) => {
	const { inertia, element, onMove, onActive } = options;
	let isDragging = false;

	const currentPosition: Position2D = { x: 0, y: 0 };
	const commitPosition: Position2D = { x: 0, y: 0 };
	const commit = () => {
		commitPosition.x = currentPosition.x;
		commitPosition.y = currentPosition.y;
	};
	const getDelta = (): Position2D => {
		return {
			x: currentPosition.x - commitPosition.x,
			y: currentPosition.y - commitPosition.y,
		};
	};
	const onDragMove = (event: MouseEvent | TouchEvent) => {
		if (!isDragging) return;
		event.preventDefault();
		const { clientX, clientY } = getClientPosition(event);
		const delta: Position2D = {
			x: clientX - currentPosition.x,
			y: clientY - currentPosition.y,
		};
		currentPosition.x = clientX;
		currentPosition.y = clientY;
		onMove(delta);
	};

	const onDragStart = (event: MouseEvent | TouchEvent) => {
		isDragging = true;
		inertia.stop();
		const { clientX, clientY } = getClientPosition(event);
		currentPosition.x = clientX;
		currentPosition.y = clientY;
		commit();
	};

	const onDragEnd = () => {
		isDragging = false;
	};

	const stopAnimation = startAnimation((msTime: number) => {
		const time = msTime / 1000;
		if (isDragging) {
			const delta = getDelta();
			inertia.setDelta(delta, time);
			commit();
			onActive(true);
		} else {
			const delta: Position2D = inertia.getDelta(time);
			if (delta.x === 0 && delta.y === 0) {
				onActive(false);
				return;
			}
			onMove(delta);
			onActive(true);
		}
	});
	element.addEventListener('mousedown', onDragStart);
	document.addEventListener('mousemove', onDragMove);
	document.addEventListener('mouseup', onDragEnd);

	element.addEventListener('touchstart', onDragStart);
	document.addEventListener('touchmove', onDragMove);
	document.addEventListener('touchend', onDragEnd);

	return () => {
		stopAnimation();
		element.removeEventListener('mousedown', onDragStart);
		document.removeEventListener('mousemove', onDragMove);
		document.removeEventListener('mouseup', onDragEnd);

		element.removeEventListener('touchstart', onDragStart);
		document.removeEventListener('touchmove', onDragMove);
	};
};

export type GroovedWheelProps = {
	onMove: (delta: number) => void;
	onActive: (value: boolean) => void;
	stopRef: MutableRefObject<(() => void) | null>;
	contentColor: number;
};
export const GroovedWheel: FC<GroovedWheelProps> = (props) => {
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
		onDraw: draw,
	};
	return (
		<div ref={ref} style={{ width: '100%', height: '100%' }}>
			<PixelCanvas {...pixelCanvasProps} />
		</div>
	);
};
