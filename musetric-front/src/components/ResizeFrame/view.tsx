import React from 'react'
import { ResizeFrameProps, ResizeFrameState } from './types';


export class ResizeFrameView extends React.Component<ResizeFrameProps, ResizeFrameState> {
	constructor(props: ResizeFrameProps) {
		super(props);
	}

	render() {
		return (
		<div className='resize-frame'>
			<div className='resize-band-top' />
			<div className='resize-band-bottom' />
			<div className='resize-band-left' />
			<div className='resize-band-right' />
		</div>)
	}
}