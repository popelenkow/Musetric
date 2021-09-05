import React, { FC } from 'react';
import { CgPlayStop } from 'react-icons/cg';

export type StopIconProps = {
};

export const StopIcon: FC<StopIconProps> = () => {
	return (
		<CgPlayStop size='32px' />
	);
};
