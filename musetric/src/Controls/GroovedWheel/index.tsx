import React, { useEffect, useMemo, useRef, MutableRefObject } from 'react';
import { createClasses, createUseClasses } from '../../AppContexts';
import { Position2D, Size2D, Layout2D, Direction2D } from '../../Rendering/Layout';
import { SFC } from '../../UtilityTypes';
import { createInertia } from './Inertia';
import { subscribeInertia } from './SubscribeInertia';

export const getCanvas1Classes = createClasses(() => {
	return {
		root: {
			width: '100%',
			height: '100%',
			'background-image': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='10'><rect x='2' width='2' height='10' style='fill:rgb(100,100,100);' /></svg>\")",
		},
	};
});
const useClasses = createUseClasses('Canvas1', getCanvas1Classes);

export type GroovedWheelProps = {
	onMove: (delta: number) => void,
	onActive: (value: boolean) => void,
	stopRef: MutableRefObject<(() => void) | null>,
	contentColor: number,
};
export const GroovedWheel: SFC<GroovedWheelProps> = (props) => {
	const { onMove, onActive, stopRef } = props;
	const ref = useRef<HTMLDivElement>(null);
	const classes = useClasses();

	const layout = useMemo<Layout2D>(() => {
		const size: Size2D = { width: 1000, height: 100 };
		const direction: Direction2D = { rotation: 'none', reflection: false };
		return { size, direction };
	}, []);
	const shift = useRef(0);
	useEffect(() => {
		if (!ref.current) return undefined;
		const root = ref.current;
		const inertia = createInertia({
			resistance: 2.5,
			friction: 200,
			sampleCount: 3,
		});
		stopRef.current = (): void => inertia.stop();
		const move = (delta: Position2D): void => {
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

	return (
		<div
			ref={ref}
			style={{
				backgroundPositionX: -shift.current,
			}}
			className={classes.root}
		/>
	);
};
