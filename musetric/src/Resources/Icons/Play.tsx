import React, { FC } from 'react';
import { BsFillPlayFill } from 'react-icons/bs';

export type PlayIconProps = {
};

export const PlayIcon: FC<PlayIconProps> = () => {
	return (
		<BsFillPlayFill size='32px' />
	);
};
