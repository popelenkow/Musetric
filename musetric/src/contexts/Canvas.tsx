import React, { Dispatch, SetStateAction, useState } from 'react';
import { CanvasContext } from 'react-three-fiber';

export type Store = {
	canvas?: CanvasContext; setCanvas: Dispatch<SetStateAction<CanvasContext | undefined>>;
};

export const Context = React.createContext<Store>({
	setCanvas: () => { },
});

export const { Consumer } = Context;

export type Props = {
	initCanvas?: CanvasContext;
};

export const Provider: React.FC<Props> = (props) => {
	const { children, initCanvas } = props;

	const [canvas, setCanvas] = useState<CanvasContext | undefined>(initCanvas);

	const value: Store = {
		canvas,
		setCanvas,
	};

	return (
		<Context.Provider value={value}>
			{children}
		</Context.Provider>
	);
};
