import React, { useEffect, useRef } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useLocaleContext } from '../AppContexts/Locale';
import { ComponentStateProps } from '../Hooks/ComponentState';
import { Size2D } from '../Rendering/Layout';

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
	size: Size2D;
	element: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
};

export type CanvasProps = ComponentStateProps<CanvasState> & {
	size: Size2D;
};
export const Canvas: React.FC<CanvasProps> = (props) => {
	const { size, onState, onError } = props;
	const classes = useClasses();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { t } = useLocaleContext();

	useEffect(() => {
		const element = canvasRef.current;
		if (!element) {
			onError(t('Error:ref', { element: 'Canvas' }));
			return;
		}
		element.width = size.width;
		element.height = size.height;
		const context = element.getContext('2d');
		if (!context) {
			onError(t('Error:canvasContext2D'));
			return;
		}
		context.globalCompositeOperation = 'copy';
		onState({ size, element, context });
	}, [onState, onError, t, size]);

	const canvasProps: JSX.IntrinsicElements['canvas'] = {
		className: classes.root,
		ref: canvasRef,
		...size,
	};
	return <canvas {...canvasProps} />;
};
