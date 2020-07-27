import React from 'react'
import { Props, State } from './types';
import { Recorder } from './recorder'

let audioContext = new AudioContext();
let analyserNode: AnalyserNode;
let inputPoint: GainNode;
let audioRecorder: Recorder;
let audioInput: MediaStreamAudioSourceNode | ChannelMergerNode,
	realAudioInput: MediaStreamAudioSourceNode;
let rafID: number | null = null;
let analyserContext: any = null;
let canvasWidth: any, canvasHeight: any;
let recIndex = 0;


export const saveAudio = () => {
	audioRecorder.exportWAV(doneEncoding, undefined);
}

const drawBuffer = (width: number, height: number, context: CanvasRenderingContext2D, data: any) => {
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

const doneEncoding = (blob: any) => {
	Recorder.forceDownload(blob, "myRecording" + ((recIndex < 10) ? "0" : "") + recIndex + ".wav");
	recIndex++;
}

const convertToMono = (input: any) => {
	let splitter = audioContext.createChannelSplitter(2);
	let merger = audioContext.createChannelMerger(2);

	input.connect(splitter);
	splitter.connect(merger, 0, 0);
	splitter.connect(merger, 0, 1);
	return merger;
}

export const cancelAnalyserUpdates = () => {
	rafID && cancelAnimationFrame(rafID);
	rafID = null;
}

const updateAnalysers = () => {
	if (!analyserContext) {
		let canvas = document.getElementById("analyser") as HTMLCanvasElement;
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		analyserContext = canvas.getContext('2d');
	}

	{
		let SPACING = 3;
		let BAR_WIDTH = 1;
		let numBars = Math.round(canvasWidth / SPACING);
		let freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

		analyserNode.getByteFrequencyData(freqByteData);

		analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
		analyserContext.fillStyle = '#F6D565';
		analyserContext.lineCap = 'round';
		let multiplier = analyserNode.frequencyBinCount / numBars;

		for (let i = 0; i < numBars; ++i) {
			let magnitude = 0;
			let offset = Math.floor(i * multiplier);
			for (let j = 0; j < multiplier; j++)
				magnitude += freqByteData[offset + j];
			magnitude = magnitude / multiplier;
			analyserContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
			analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
		}
	}

	rafID = requestAnimationFrame(updateAnalysers);
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
			const gotBuffers = (buffers: any) => {
				let canvas = document.getElementById("wavedisplay")  as HTMLCanvasElement;
				drawBuffer(canvas.width, canvas.height, canvas.getContext('2d') as CanvasRenderingContext2D, buffers[0]);
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
	
		analyserNode = audioContext.createAnalyser();
		analyserNode.fftSize = 2048;
		inputPoint.connect(analyserNode);
	
		audioRecorder = new Recorder(inputPoint);
	
		const zeroGain = audioContext.createGain();
		zeroGain.gain.value = 0.0;
		inputPoint.connect(zeroGain);
		zeroGain.connect(audioContext.destination);
		updateAnalysers();
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