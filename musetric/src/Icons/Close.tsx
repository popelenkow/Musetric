import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

export type CloseIconProps = {
};

export const CloseIcon: React.FC<CloseIconProps> = () => {
	return (
		<AiFillCloseCircle size='24px' />
	);
};
