import React, { useState, useEffect } from 'react';
import { ipc } from '../../ipc';

export type Props = {
};

export const View: React.FC<Props> = () => {
	const [isMaximized, setIsMaximized] = useState(false);

	useEffect(() => {
		ipc.onWindow.on((_event, arg) => {
			setIsMaximized(arg.isMaximized);
		});
	});

	return !isMaximized ? (
		<div className='ResizeFrame'>
			<div className='ResizeFrame__Top' />
			<div className='ResizeFrame__Bottom' />
			<div className='ResizeFrame__Left' />
			<div className='ResizeFrame__Right' />
		</div>
	) : <div />;
};
