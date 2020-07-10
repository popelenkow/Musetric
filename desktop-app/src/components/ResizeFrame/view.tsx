import React from 'react'
import { ResizeFrameProps, ResizeFrameState } from './types';
import { ipcRenderer } from 'electron';
import { channels } from '../../channels';


export class ResizeFrameView extends React.Component<ResizeFrameProps, ResizeFrameState> {
	constructor(props: ResizeFrameProps) {
		super(props);
		this.state = { isMaximized: false }
	}

	componentDidMount() {
		ipcRenderer.on(channels.onMaximizeWindow, (_, isMaximized) => {
			this.setState({ isMaximized: isMaximized })
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