import React from 'react'
import { Props, State } from './types';
import { ipc } from '../../ipc';

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { isMaximized: false }
	}

	componentDidMount() {
		ipc.onWindow.on((_event, arg) => {
			this.setState(arg)
		});	
	}

	render() {
		return !this.state.isMaximized && (
		<div className='resize-frame'>
			<div className='resize-band-top' />
			<div className='resize-band-bottom' />
			<div className='resize-band-left' />
			<div className='resize-band-right' />
		</div>)
	}
}