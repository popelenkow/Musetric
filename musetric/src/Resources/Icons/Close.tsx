import React, { FC } from 'react';
import { CgClose } from 'react-icons/cg';

export type CloseIconProps = {
};

export const CloseIcon: FC<CloseIconProps> = () => {
	return (
		<CgClose size='28px' />
	);
};
