import React, { useState, useEffect, useRef } from 'react';
import { Recorder } from './recorder';
import { drawSpectrum, drawWave, startAnimation, Model } from './model';

export type RecorderProps = {
	model: Model;
	drop: () => void;
}

export const RecorderView: React.FC<RecorderProps> = (props) => {
	const { model, drop } = props;
	const { analyserNode, recorder } = model;

	const [isRecording, setIsRecording] = useState<boolean>(false);

	const spectrumCanvas = useRef<HTMLCanvasElement>(null);
	const waveCanvas = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const startSpectrum = () => {
			const draw = () => {
				const canvas = spectrumCanvas.current;
				const data = new Uint8Array(analyserNode.frequencyBinCount);
				analyserNode.getByteFrequencyData(data);
				const info = { canvas, data };
				drawSpectrum(info, analyserNode.frequencyBinCount);
			};
			return startAnimation(draw);
		};

		const subscription = startSpectrum();
		return () => {
			subscription.stop();
		};
	}, [analyserNode]);

	const saveAudio = () => {
		const doneEncoding = (blob: Blob) => Recorder.forceDownload(blob, 'myRecording.wav');
		recorder.exportWAV(doneEncoding, undefined);
	};

	const start = async () => {
		recorder.record();
		setIsRecording(true);
	};

	const stop = async () => {
		const gotBuffers = (buffers: Float32Array[]) => {
			const canvas = waveCanvas.current;
			const data = buffers[0];
			drawWave({ canvas, data });
		};
		recorder.stop();
		recorder.getBuffer(gotBuffers);
		// audioRecorder.clear();
		setIsRecording(false);
	};

	return (
		<div className='Recorder'>
			<div id='controls' className='Recorder__Header'>
				{!isRecording && <button type='button' className='Button' onClick={start}>start</button>}
				{isRecording && <button type='button' className='Button' onClick={stop}>stop</button>}
				<button type='button' className='Button' onClick={saveAudio}>save</button>
				<button type='button' className='Button' onClick={drop}>drop</button>
			</div>
			<div className='Recorder__Wave'>
				<canvas className='Recorder_Canvas' ref={waveCanvas} width={1024} height={1024} />
			</div>
			<div className='Recorder__Spectrum'>
				<canvas className='Recorder_Canvas' ref={spectrumCanvas} width={1024} height={1024} />
			</div>
		</div>
	);
};
