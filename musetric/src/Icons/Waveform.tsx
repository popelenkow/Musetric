import React from 'react';

export type WaveformIconProps = {
};

/** Based on https://github.com/iconic/open-iconic */
export const WaveformIcon: React.FC<WaveformIconProps> = () => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 8 8'>
			<path d='M4 0v8h1v-8h-1zm-2 1v6h1v-6h-1zm4 1v4h1v-4h-1zm-6 1v2h1v-2h-1z' />
		</svg>
	);
};
