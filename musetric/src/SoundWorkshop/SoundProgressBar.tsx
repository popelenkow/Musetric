import React, { useMemo } from 'react';
import {
	SoundBuffer, SoundCircularBuffer, useWaveform,
	MasterCanvas, MasterCanvasProps, MasterCanvasItem,
	Size2D, Direction2D, rotateSize2D,
} from '..';

export const useSoundProgressBar = (
	soundBuffer: SoundBuffer,
	soundCircularBuffer: SoundCircularBuffer,
) => {
	const waveformLayout = useMemo(() => {
		const size: Size2D = { width: 32, height: 256 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
		return { size, direction };
	}, []);
	const waveform = useWaveform({
		soundBuffer,
		soundCircularBuffer,
		size: waveformLayout.size,
	});
	const waveformItem: MasterCanvasItem = {
		image: waveform.image,
		layout: waveformLayout,
		onClick: waveform.onClick,
	};

	// eslint-disable-next-line max-len
	const masterCanvasSize = useMemo(() => rotateSize2D(waveformLayout.size, waveformLayout.direction), [waveformLayout]);
	const masterCanvasProps: MasterCanvasProps = {
		items: [waveformItem],
		size: masterCanvasSize,
	};
	const progressBarView = <MasterCanvas {...masterCanvasProps} />;

	return { progressBarView };
};
