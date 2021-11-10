import React, { useMemo, ReactElement } from 'react';
import { SoundBufferManager } from '../Sounds';
import { Size2D, Direction2D } from '../Rendering/Layout';
import { Waveform, WaveformProps } from '../Controls/Waveform';

export type SoundProgressBar = {
	renderProgressBarView: () => ReactElement;
};
export const useSoundProgressBar = (
	soundBufferManager: SoundBufferManager,
): SoundProgressBar => {
	const waveformLayout = useMemo(() => {
		const size: Size2D = { width: 128, height: 1024 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
		return { size, direction };
	}, []);
	const waveformProps: WaveformProps = {
		soundBufferManager,
		layout: waveformLayout,
	};

	return {
		renderProgressBarView: () => <Waveform {...waveformProps} />,
	};
};
