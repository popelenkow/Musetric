import React from 'react';
import { Props, State } from './types';
import { Recorder } from './recorder';

let audioRecorder: Recorder;

const saveAudio = () => {
	const doneEncoding = (blob: Blob) => Recorder.forceDownload(blob, 'myRecording.wav');
	audioRecorder.exportWAV(doneEncoding, undefined);
};

// eslint-disable-next-line max-len
const drawBuffer = (width: number, height: number, context: CanvasRenderingContext2D, data: Float32Array) => {
	const step = Math.ceil(data.length / width);
	const amp = height / 2;
	context.fillStyle = 'silver';
	context.clearRect(0, 0, width, height);
	for (let i = 0; i < width; i++) {
		let min = 1.0;
		let max = -1.0;
		for (let j = 0; j < step; j++) {
			const datum = data[(i * step) + j];
			if (datum < min) {
				min = datum;
			}
			if (datum > max) {
				max = datum;
			}
		}
		context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
	}
};

const updateAnalysers = (analyserNode: AnalyserNode) => {
	const canvas = document.getElementById('analyser') as HTMLCanvasElement;
	const analyserContext = canvas.getContext('2d') as CanvasRenderingContext2D;

	const SPACING = 10;
	const BAR_WIDTH = 10;
	const numBars = Math.round(canvas.width / SPACING);
	const freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

	analyserNode.getByteFrequencyData(freqByteData);

	analyserContext.fillStyle = 'black';
	analyserContext.lineCap = 'round';
	analyserContext.clearRect(0, 0, canvas.width, canvas.height);

	const multiplier = Math.floor(analyserNode.frequencyBinCount / numBars);

	for (let i = 0; i < numBars; i++) {
		let magnitude = 0;
		const offset = Math.floor(i * multiplier);
		for (let j = 0; j < multiplier; j++) {
			magnitude += freqByteData[offset + j];
		}
		magnitude = (magnitude / multiplier / 255) * canvas.height;
		analyserContext.fillStyle = `hsl( ${Math.round((i * 360) / numBars)}, 100%, 50%)`;
		analyserContext.fillRect(i * SPACING, canvas.height, BAR_WIDTH, -magnitude);
	}

	const rafID = requestAnimationFrame((_time) => {
		updateAnalysers(analyserNode);
	});
	const cancelAnalyserUpdates = () => {
		cancelAnimationFrame(rafID);
	};
	// eslint-disable-next-line no-unused-expressions
	cancelAnalyserUpdates;
};

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { isRecording: false };
	}

	toggleRecording = async () => {
		const { isRecording } = this.state;
		if (!audioRecorder) {
			await this.initAudio();
		}
		if (isRecording) {
			const gotBuffers = (buffers: Float32Array[]) => {
				const buf = buffers[0];
				const canvas = document.getElementById('wavedisplay') as HTMLCanvasElement;
				drawBuffer(canvas.width, canvas.height, canvas.getContext('2d') as CanvasRenderingContext2D, buf);
			};
			audioRecorder.stop();
			audioRecorder.getBuffer(gotBuffers);
		} else {
			// audioRecorder.clear();
			audioRecorder.record();
		}
		this.setState({ isRecording: !isRecording });
	}

	initAudio = async () => {
		const audioContext = new AudioContext();
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const inputPoint = audioContext.createGain();

		const realAudioInput = audioContext.createMediaStreamSource(stream);
		realAudioInput.connect(inputPoint);

		const analyserNode = audioContext.createAnalyser();
		analyserNode.fftSize = 2048;
		inputPoint.connect(analyserNode);

		audioRecorder = new Recorder(inputPoint);

		const zeroGain = audioContext.createGain();
		zeroGain.gain.value = 0.0;
		inputPoint.connect(zeroGain);
		zeroGain.connect(audioContext.destination);
		updateAnalysers(analyserNode);
	}

	render() {
		const { isRecording } = this.state;

		return (
			<div className='Recorder'>
				<div id='controls' className='Recorder__Header'>
					{ !isRecording && <button type='button' className='Button' onClick={this.toggleRecording}>start</button> }
					{ isRecording && <button type='button' className='Button' onClick={this.toggleRecording}>stop</button> }
					<button type='button' className='Button' onClick={saveAudio}>save</button>
				</div>
				<div className='Recorder__Container'>
					<div className='Recorder__Wavedisplay'>
						<canvas id='wavedisplay' width='1024' height='100' />
					</div>
					<div className='Recorder__Analyser'>
						<canvas id='analyser' width='1024' height='100' />
					</div>
				</div>
			</div>
		);
	}
}
