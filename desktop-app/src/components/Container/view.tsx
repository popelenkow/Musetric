import React from 'react'
import { ContainerProps, ContainerState } from './types';


export class ContainerView extends React.Component<ContainerProps, ContainerState> {
	constructor(props: ContainerProps) {
		super(props);
	}

	render() {
		return (
		<div className='container'>
			{this.props.children}
		</div>)
	}
}