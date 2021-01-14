import React, { useState, useContext, useEffect } from 'react';
import { Color } from 'three';
import { Canvas, CanvasContext } from 'react-three-fiber';
import { Contexts, CanvasHelpers } from '../..';

type PureProps = {
	canvas?: CanvasContext;
};

const PureView : React.FC<PureProps> = (props) => {
	const { children } = props;

	const appStore = useContext(Contexts.App.Context);
	const { appElement, theme } = appStore;
	const canvasStore = useContext(Contexts.Canvas.Context);
	const { canvas, setCanvas } = canvasStore;

	const [color, setColor] = useState<Color>(new Color(0, 0, 0));

	useEffect(() => {
		if (!theme) return;
		if (!appElement) return;
		const c = CanvasHelpers.getColor(appElement, '--color__contentBg');
		setColor(c || new Color(0, 0, 0));
	}, [theme, appElement]);

	useEffect(() => {
		if (!canvas) return;
		canvas.gl.setClearColor(color);
	}, [color, canvas]);

	return (
		<Canvas onCreated={setCanvas} colorManagement={false}>
			<Contexts.App.Context.Provider value={appStore}>
				<Contexts.Canvas.Context.Provider value={canvasStore}>
					{children}
				</Contexts.Canvas.Context.Provider>
			</Contexts.App.Context.Provider>
		</Canvas>
	);
};

export type Props = {
};

export const View: React.FC<Props> = (props) => {
	const { children } = props;

	return (
		<Contexts.Canvas.Provider>
			<PureView>
				{children}
			</PureView>
		</Contexts.Canvas.Provider>
	);
};
