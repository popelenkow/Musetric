import React from 'react';
import { Recorder } from './recorder';
import { Model } from './model';

export type InitProps = {
	setModel: (model: Model) => void
}

export const InitView: React.FC<InitProps> = (props) => {
	const { setModel } = props;

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
		<button type='button' className='Button' style={{ height: '100%' }} onClick={init}>init</button>
	);
};
