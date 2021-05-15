import React from 'react';

import {
	SoundBuffer, useWaveform, CanvasView,
} from '..';

export const useSoundProgressBar = (soundBuffer: SoundBuffer) => {
	const progressBarProps = useWaveform({
		soundBuffer,
		size: { width: 600, height: 50 },
	});

	const progressBarView = <CanvasView {...progressBarProps} />;

	return { progressBarView };
};
