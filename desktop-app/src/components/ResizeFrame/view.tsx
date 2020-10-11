import React from 'react';
import { Props, State } from './types';
import { ipc } from '../../ipc';

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { isMaximized: false };
	}

	componentDidMount() {
		ipc.onWindow.on((_event, arg) => {
			this.setState(arg);
		});
	}

	render() {
		const isMaximized = this.state;
		return !isMaximized && (
			<div className='ResizeFrame'>
				<div className='ResizeFrame__Top' />
				<div className='ResizeFrame__Bottom' />
				<div className='ResizeFrame__Left' />
				<div className='ResizeFrame__Right' />
			</div>
		);
	}
}
