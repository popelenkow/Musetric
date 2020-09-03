import React from 'react';
import { Props } from './types';
import { icons } from './icons';

export const View: React.FunctionComponent<Props> = (props) => {
	const { children } = props;
	return (
		<div className='Titlebar'>
			<div className='Titlebar__Icon'>{icons.app}</div>
			<div className='Titlebar__Text'>Musetric</div>
			{children}
		</div>
	);
};
