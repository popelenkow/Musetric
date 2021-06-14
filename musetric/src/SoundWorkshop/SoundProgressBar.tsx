import React from 'react';

import {
	SoundBuffer, SoundCircularBuffer, useWaveform,
	PixelCanvas, PixelCanvasProps,
} from '..';

export const useSoundProgressBar = (
	soundBuffer: SoundBuffer,
	soundCircularBuffer: SoundCircularBuffer,
) => {
	const size = { width: 256, height: 32 };

	const waveform = useWaveform({
		soundBuffer,
		soundCircularBuffer,
	});

	const canvasViewProps: PixelCanvasProps = {
		...waveform,
		size,
		direction: { rotation: 'left', reflection: false },
	};

	const progressBarView = <PixelCanvas {...canvasViewProps} />;

	return { progressBarView };
};
