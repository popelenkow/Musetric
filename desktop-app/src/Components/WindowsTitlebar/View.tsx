import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Ipc } from '../../Ipc';

export type Props = {
};

export const View: React.FC<Props> = () => {
	const [isMaximized, setIsMaximized] = useState(false);

	useEffect(() => {
		Ipc.onWindow.on((_event, arg) => {
			setIsMaximized(arg.isMaximized);
		});
	}, []);

	return (
		<div className='WindowsTitlebar'>
			<button type='button' className='WindowsTitlebar__Button' onClick={() => Ipc.titlebar.invoke('minimize')}>
				{Icons.minimize}
			</button>
			<button type='button' className='WindowsTitlebar__Button' onClick={() => (isMaximized ? Ipc.titlebar.invoke('unmaximize') : Ipc.titlebar.invoke('maximize'))}>
				{isMaximized ? Icons.unmaximize : Icons.maximize}
			</button>
			<button type='button' className='WindowsTitlebar__CloseButton' onClick={() => Ipc.titlebar.invoke('close')}>
				{Icons.close}
			</button>
		</div>
	);
};
