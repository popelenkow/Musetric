/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Props, State } from './types';

export class View extends React.Component<Props, State> {
	render() {
		const { children } = this.props;
		return (
			<div className='Container'>
				{children}
			</div>
		);
	}
}
