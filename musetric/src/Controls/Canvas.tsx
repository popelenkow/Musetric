import React, { useEffect, useRef } from 'react';
import { useAppLocale, useAppLog } from '../App/AppContext';
import { createUseClasses, createClasses } from '../App/AppCss';
import { Size2D } from '../Rendering/Layout';
import { SFC } from '../UtilityTypes/React';

export const getCanvasClasses = createClasses(() => {
	return {
		root: {
			width: '100%',
			height: '100%',
		},
	};
});
const useClasses = createUseClasses('Canvas', getCanvasClasses);

export type CanvasState = {
	size: Size2D,
	element: HTMLCanvasElement,
	context: CanvasRenderingContext2D,
};

export type CanvasProps = {
	size: Size2D,
	setState: (state: CanvasState) => void,
};
export const Canvas: SFC<CanvasProps> = (props) => {
	const { size, setState } = props;
	const classes = useClasses();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { i18n } = useAppLocale();
	const log = useAppLog();

	useEffect(() => {
		const element = canvasRef.current;
		if (!element) {
			log.error(i18n.t('Error:ref', { element: 'Canvas' }));
			return;
		}
		element.width = size.width;
		element.height = size.height;
		const context = element.getContext('2d');
		if (!context) {
			log.error(i18n.t('Error:canvasContext2D'));
			return;
		}
		context.globalCompositeOperation = 'copy';
		setState({ size, element, context });
	}, [setState, log, i18n, size]);

	const canvasProps: JSX.IntrinsicElements['canvas'] = {
		className: classes.root,
		ref: canvasRef,
		...size,
	};
	return <canvas {...canvasProps} />;
};
