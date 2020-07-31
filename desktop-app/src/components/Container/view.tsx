import React from 'react'
import { Props, State } from './types';

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (
		<div className='Container'>
			{this.props.children}
		</div>)
	}
}