import React from 'react';

import {
	SoundBuffer, useWaveform, CanvasView,
} from '..';

export type UseSoundProgressBarProps = {
	soundBuffer: SoundBuffer;
};

export const useSoundProgressBar = (props: UseSoundProgressBarProps) => {
	const { soundBuffer } = props;

	const progressBarProps = useWaveform({
		soundBuffer,
		size: { width: 600, height: 50 },
	});

	const progressBarView = <CanvasView {...progressBarProps} />;

	return { progressBarView };
};
