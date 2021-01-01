import React, { useState } from 'react';
import { Recorder } from './recorder';
import { Model } from './model';
import { RecorderView } from './ModelView';

export type Props = {
};

export const View: React.FC<Props> = () => {
	const [model, setModel] = useState<Model>();

	const init = async () => {
		const audioContext = new AudioContext();
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const inputPoint = audioContext.createGain();

		const realAudioInput = audioContext.createMediaStreamSource(stream);
		realAudioInput.connect(inputPoint);

		const analyserNode = audioContext.createAnalyser();
		analyserNode.fftSize = 2048;
		inputPoint.connect(analyserNode);

		const recorder = new Recorder(inputPoint);

		const zeroGain = audioContext.createGain();
		zeroGain.gain.value = 0.0;
		inputPoint.connect(zeroGain);
		zeroGain.connect(audioContext.destination);
		setModel({ recorder, analyserNode, audioContext });
	};

	return (
		<div className='RecorderView'>
			{ !model && <button type='button' className='Button' style={{ height: '100%' }} onClick={init}>init</button> }
			{ model && <RecorderView model={model} drop={() => setModel(undefined)} /> }
		</div>
	);
};
