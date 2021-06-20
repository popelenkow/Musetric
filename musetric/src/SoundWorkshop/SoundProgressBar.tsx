import React, { useMemo } from 'react';
import {
	SoundBuffer, SoundCircularBuffer, useWaveform,
	PixelCanvas, PixelCanvasProps,
	Size2D, Direction2D,
} from '..';

export const useSoundProgressBar = (
	soundBuffer: SoundBuffer,
	soundCircularBuffer: SoundCircularBuffer,
) => {
	const waveformLayout = useMemo(() => {
		const size: Size2D = { width: 256, height: 32 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
		return { size, direction };
	}, []);
	const waveform = useWaveform({
		soundBuffer,
		soundCircularBuffer,
	});
	const waveformProps: PixelCanvasProps = {
		...waveform, ...waveformLayout,
	};

	const progressBarView = <PixelCanvas {...waveformProps} />;

	return { progressBarView };
};
