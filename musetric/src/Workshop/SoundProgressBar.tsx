import React, { useMemo, FC } from 'react';
import { SoundBufferManager } from '../Sounds';
import { MasterCanvas, MasterCanvasProps, MasterCanvasItem } from '../RenderingComponents/MasterCanvas';
import { Size2D, Direction2D, rotateSize2D } from '../Rendering/Layout';
import { useWaveform } from '../RenderingComponents/Waveform';

export type SoundProgressBar = {
	ProgressBarView: FC;
};
export const useSoundProgressBar = (
	soundBufferManager: SoundBufferManager,
): SoundProgressBar => {
	const waveformLayout = useMemo(() => {
		const size: Size2D = { width: 128, height: 1024 };
		const direction: Direction2D = { rotation: 'left', reflection: false };
		return { size, direction };
	}, []);
	const waveform = useWaveform({
		soundBufferManager,
		size: waveformLayout.size,
	});
	const waveformItem: MasterCanvasItem = {
		image: waveform.image,
		layout: waveformLayout,
		onClick: waveform.onClick,
	};

	const masterCanvasSize = useMemo(() => {
		const { size, direction } = waveformLayout;
		return rotateSize2D(size, direction);
	}, [waveformLayout]);
	const masterCanvasProps: MasterCanvasProps = {
		items: [waveformItem],
		size: masterCanvasSize,
	};
	const ProgressBarView: FC = () => <MasterCanvas {...masterCanvasProps} />;

	return { ProgressBarView };
};
