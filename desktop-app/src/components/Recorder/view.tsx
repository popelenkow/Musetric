import React from 'react'
import { Props, State } from './types';
import { Recorder } from './recorder'

let audioContext = new AudioContext();

let inputPoint: GainNode;
let audioRecorder: Recorder;
let audioInput: MediaStreamAudioSourceNode | ChannelMergerNode;
let realAudioInput: MediaStreamAudioSourceNode;


export const saveAudio = () => {
	audioRecorder.exportWAV(doneEncoding, undefined);
}

const drawBuffer = (width: number, height: number, context: CanvasRenderingContext2D, data: Float32Array) => {
	let step = Math.ceil(data.length / width);
	let amp = height / 2;
	context.fillStyle = "silver";
	context.clearRect(0, 0, width, height);
	for (let i = 0; i < width; i++) {
		let min = 1.0;
		let max = -1.0;
		for (let j = 0; j < step; j++) {
			let datum = data[(i * step) + j];
			if (datum < min)
				min = datum;
			if (datum > max)
				max = datum;
		}
		context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
	}
}

const doneEncoding = (blob: Blob) => {
	Recorder.forceDownload(blob, "myRecording.wav");
}

const convertToMono = (input: MediaStreamAudioSourceNode) => {
	let splitter = audioContext.createChannelSplitter(2);
	let merger = audioContext.createChannelMerger(2);

	input.connect(splitter);
	splitter.connect(merger, 0, 0);
	splitter.connect(merger, 0, 1);
	return merger;
}

const updateAnalysers = (analyserNode: AnalyserNode) => {
	const canvas = document.getElementById("analyser") as HTMLCanvasElement;
	const analyserContext = canvas.getContext('2d') as CanvasRenderingContext2D;
	
	const SPACING = 3;
	const BAR_WIDTH = 1;
	const numBars = Math.round(canvas.width / SPACING);
	const freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

	analyserNode.getByteFrequencyData(freqByteData);

	analyserContext.fillStyle = 'black';
	analyserContext.lineCap = 'round';
	analyserContext.fillRect(0, 0, canvas.width, canvas.height);

	const multiplier = analyserNode.frequencyBinCount / numBars;

	for (let i = 0; i < numBars; i++) {
		let magnitude = 0;
		const offset = Math.floor(i * multiplier);
		for (let j = 0; j < multiplier; j++)
			magnitude += freqByteData[offset + j];
		magnitude = magnitude / multiplier;
		analyserContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
		analyserContext.fillRect(i * SPACING, canvas.height, BAR_WIDTH, -magnitude);
	}

	const rafID = requestAnimationFrame((_time) => {
		updateAnalysers(analyserNode)
	});
	const cancelAnalyserUpdates = () => {
		cancelAnimationFrame(rafID);
	}
	cancelAnalyserUpdates;
}

export const toggleMono = () => {
	if (audioInput != realAudioInput) {
		audioInput.disconnect();
		realAudioInput.disconnect();
		audioInput = realAudioInput;
	} else {
		realAudioInput.disconnect();
		audioInput = convertToMono(realAudioInput);
	}

	audioInput.connect(inputPoint);
}



export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { isRecording: false, list: [] }
	}

	toggleRecording = () => {
		if (this.state.isRecording) {
			const gotBuffers = (buffers: Float32Array[]) => {
				const buf = buffers[0];
				let canvas = document.getElementById("wavedisplay")  as HTMLCanvasElement;
				drawBuffer(canvas.width, canvas.height, canvas.getContext('2d') as CanvasRenderingContext2D, buf);
				audioRecorder.exportWAV(doneEncoding, undefined);
			}
			audioRecorder.stop();
			audioRecorder.getBuffer(gotBuffers);
		} else {
			audioRecorder.clear();
			audioRecorder.record();
		}
		const isRecording = !this.state.isRecording;
		this.setState({ isRecording })
	}

	initAudio = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		inputPoint = audioContext.createGain();
	
		realAudioInput = audioContext.createMediaStreamSource(stream);
		audioInput = realAudioInput;
		audioInput.connect(inputPoint);
	
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

	componentDidMount() {
		this.initAudio()
	}
	
	render() {
		const { isRecording } = this.state;

		return (
		<>
			<div id="viz">
				<canvas id="analyser" width="1024" height="500"></canvas>
				<canvas id="wavedisplay" width="1024" height="500"></canvas>
			</div>
			<div id="controls">
				{ !isRecording && <button className='record' onClick={this.toggleRecording} >start</button> }
				{ isRecording && <button className='record-recording' onClick={this.toggleRecording} >stop</button> }
				<button className='record' onClick={saveAudio}>save</button>
			</div>
		</>)
	}
}