/* eslint-disable react/prefer-stateless-function */
import React from 'react';

export type Props = {
};

export const View: React.FC<Props> = (props) => {
	const { children } = props;
	return (
		<div className='Container'>
			{children}
		</div>
	);
};
