import React, { useEffect, useMemo, useRef, MutableRefObject } from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { Position2D, Size2D, Layout2D, Direction2D } from '../../Rendering/Layout';
import { SFC } from '../../UtilityTypes/React';
import { createInertia } from './Inertia';
import { subscribeInertia } from './SubscribeInertia';

export const getGroovedWheelClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			width: '100%',
			height: '100%',
			'-webkit-mask-image': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect x='4' width='2' height='10' /></svg>\")",
			'background-color': theme.divider,
		},
	};
});
const useClasses = createUseClasses('GroovedWheel', getGroovedWheelClasses);

export type GroovedWheelProps = {
	onMove: (delta: number) => void,
	onActive: (value: boolean) => void,
	stopRef: MutableRefObject<(() => void) | null>,
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
				WebkitMaskPositionX: -shift.current,
			}}
			className={classes.root}
		/>
	);
};
