import React from 'react'
import { Props, State } from './types';
import { icons } from './icons';

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (
		<div className='Titlebar'>
			<div className="Titlebar__Icon">{icons.app}</div>
			<div className="Titlebar__Text">Musetric</div>
			{this.props.children}
		</div>)
	}
}