import { Recorder } from './recorder'

let audioContext = new AudioContext();
let analyserNode: any;

let audioInput: any = null,
	realAudioInput: any = null,
	inputPoint: any = null,
	audioRecorder: any = null;
let rafID: any = null;
let analyserContext: any = null;
let canvasWidth: any, canvasHeight: any;
let recIndex = 0;


export const saveAudio = () => {
	audioRecorder.exportWAV(doneEncoding);
}

function drawBuffer(width: any, height: any, context: any, data: any) {
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


const gotBuffers = (buffers: any) => {
	let canvas: any = document.getElementById("wavedisplay");

	drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);

	// the ONLY time gotBuffers is called is right after a new recording is completed - 
	// so here's where we should set up the download.
	audioRecorder.exportWAV(doneEncoding);
}

const doneEncoding = (blob: any) => {
	Recorder.forceDownload(blob, "myRecording" + ((recIndex < 10) ? "0" : "") + recIndex + ".wav");
	recIndex++;
}

const toggleRecording = (event: any) => {
	if (event.classList.contains("recording")) {
		// stop recording
		audioRecorder.stop();
		event.classList.remove("recording");
		audioRecorder.getBuffer(gotBuffers);
	} else {
		// start recording
		if (!audioRecorder)
			return;
		event.classList.add("recording");
		audioRecorder.clear();
		audioRecorder.record();
	}
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
	window.cancelAnimationFrame(rafID);
	rafID = null;
}

const updateAnalysers = (time: any) => {
	if (!analyserContext) {
		let canvas: any = document.getElementById("analyser");
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		analyserContext = canvas.getContext('2d');
	}

	// analyzer draw code here
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

		// Draw rectangle for each frequency bin.
		for (let i = 0; i < numBars; ++i) {
			let magnitude = 0;
			let offset = Math.floor(i * multiplier);
			// gotta sum/average the block, or we miss narrow-bandwidth spikes
			for (let j = 0; j < multiplier; j++)
				magnitude += freqByteData[offset + j];
			magnitude = magnitude / multiplier;
			// let magnitude2 = freqByteData[i * multiplier];
			analyserContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
			analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
		}
	}

	rafID = window.requestAnimationFrame(updateAnalysers);
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

const gotStream = (stream: any) => {
	inputPoint = audioContext.createGain();

	// Create an AudioNode from the stream.
	realAudioInput = audioContext.createMediaStreamSource(stream);
	audioInput = realAudioInput;
	audioInput.connect(inputPoint);

	//    audioInput = convertToMono( input );

	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect(analyserNode);

	audioRecorder = new Recorder(inputPoint);

	let zeroGain = audioContext.createGain();
	zeroGain.gain.value = 0.0;
	inputPoint.connect(zeroGain);
	zeroGain.connect(audioContext.destination);
	updateAnalysers(undefined);
}

export const initAudio = () => {
	const rrr = document.getElementById('record');
	rrr && rrr.addEventListener('click', (el) => toggleRecording(rrr))


	const navigator: any = window.navigator;
	if (!navigator.getUserMedia)
		navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	if (!navigator.cancelAnimationFrame)
		navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
	if (!navigator.requestAnimationFrame)
		navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

	navigator.getUserMedia(
		{
			"audio": {
				"mandatory": {
					"googEchoCancellation": "false",
					"googAutoGainControl": "false",
					"googNoiseSuppression": "false",
					"googHighpassFilter": "false"
				},
				"optional": []
			},
		}, gotStream, (event: any) => {
			alert('Error getting audio');
			console.log(event);
		});
}
