/* eslint-disable jsx-a11y/media-has-caption */
import React, { useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import { Model, createModel } from './model';
import { FrequencyGraph, WaveGraph } from '..';

export type RecorderProps = {
	model: Model;
	drop: () => void;
};

export const RecorderView: React.FC<RecorderProps> = (props) => {
	const { model, drop } = props;
	const { mediaStream, recorder } = model;

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [audioData, setAudioData] = useState<Float32Array>();
	const [blob, setBlob] = useState<Blob>();
	const url = useMemo(() => (blob ? URL.createObjectURL(blob) : undefined), [blob]);

	const saveAudio = () => {
		if (!blob) return;
		saveAs(blob, 'myRecording.wav');
	};

	const start = () => {
		setBlob(undefined);
		recorder.start();
		setIsRecording(true);
	};

	const stop = async () => {
		recorder.stop();
		const buffers = await recorder.getBuffer();
		setAudioData(buffers[0]);
		const b = await recorder.exportWav(undefined);
		setBlob(b);
		// recorder.clear();
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
			<div className='Recorder__Content'>
				{url && <audio className='recorder-item' key={url} controls src={url} />}
			</div>
			<div className='Recorder__Content'>
				{audioData && <WaveGraph.View audioData={audioData} />}
			</div>
			<div className='Recorder__Content'>
				<FrequencyGraph.View mediaStream={mediaStream} />
			</div>
		</div>
	);
};

export type Props = {
};

export const View: React.FC<Props> = () => {
	const [model, setModel] = useState<Model>();

	const init = async () => {
		const value = await createModel();
		setModel(value);
	};

	return (
		<div className='RecorderView'>
			{ !model && <button type='button' className='Button' style={{ height: '100%' }} onClick={init}>init</button> }
			{ model && <RecorderView model={model} drop={() => setModel(undefined)} /> }
		</div>
	);
};
