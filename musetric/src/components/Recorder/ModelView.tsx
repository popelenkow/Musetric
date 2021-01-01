import React, { useState } from 'react';
import { Recorder } from './recorder';
import { Model } from './model';
import { FrequencyGraph, WaveGraph } from '..';

export type RecorderProps = {
	model: Model;
	drop: () => void;
};

export const RecorderView: React.FC<RecorderProps> = (props) => {
	const { model, drop } = props;
	const { analyserNode, recorder } = model;

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [audioData, setAudioData] = useState<Float32Array>();

	const saveAudio = () => {
		const doneEncoding = (blob: Blob) => Recorder.forceDownload(blob, 'myRecording.wav');
		recorder.exportWAV(doneEncoding, undefined);
	};

	const start = () => {
		recorder.record();
		setIsRecording(true);
	};

	const stop = () => {
		const gotBuffers = (buffers: Float32Array[]) => {
			setAudioData(buffers[0]);
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
				{audioData && <WaveGraph.View audioData={audioData} />}
			</div>
			<div className='Recorder__Spectrum'>
				<FrequencyGraph.View analyserNode={analyserNode} />
			</div>
		</div>
	);
};
