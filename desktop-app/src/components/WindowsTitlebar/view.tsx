/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { icons } from './icons';
import { ipc } from '../../ipc';

export const View: React.FC<{}> = () => {
	const [isMaximized, setIsMaximized] = useState(false);

	useEffect(() => {
		ipc.onWindow.on((_event, arg) => {
			setIsMaximized(arg.isMaximized);
		});
	}, []);

	return (
		<div className='WindowsTitlebar'>
			<button type='button' className='WindowsTitlebar__Button' onClick={() => ipc.titlebar.invoke('minimize')}>
				{icons.minimize}
			</button>
			<button type='button' className='WindowsTitlebar__Button' onClick={() => (isMaximized ? ipc.titlebar.invoke('unmaximize') : ipc.titlebar.invoke('maximize'))}>
				{isMaximized ? icons.unmaximize : icons.maximize}
			</button>
			<button type='button' className='WindowsTitlebar__CloseButton' onClick={() => ipc.titlebar.invoke('close')}>
				{icons.close}
			</button>
		</div>
	);
};
