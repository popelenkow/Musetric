import React from 'react';

import {
	SoundBuffer, SoundCircularBuffer, useWaveform, CanvasView,
} from '..';

export const useSoundProgressBar = (
	soundBuffer: SoundBuffer,
	soundCircularBuffer: SoundCircularBuffer,
) => {
	const progressBarProps = useWaveform({
		soundBuffer,
		soundCircularBuffer,
		size: { width: 600, height: 50 },
	});

	const progressBarView = <CanvasView {...progressBarProps} />;

	return { progressBarView };
};
