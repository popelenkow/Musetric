/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import { Model, createModel } from './Model';
import { Frequency, Waveform } from '..';

const mergeBuffers = (recordBuffers: Float32Array[], recordLength: number) => {
	const result = new Float32Array(recordLength);
	let offset = 0;
	for (let i = 0; i < recordBuffers.length; i++) {
		result.set(recordBuffers[i], offset);
		offset += recordBuffers[i].length;
	}
	return result;
};

export type RecorderProps = {
	model: Model;
	drop: () => void;
};

export const RecorderView: React.FC<RecorderProps> = (props) => {
	const { model, drop } = props;
	const { mediaStream, audioContext, recorder, wavCoder } = model;

	const [isRecording, setIsRecording] = useState<boolean>(false);

	const [audioData, setAudioData] = useState<Float32Array>();
	const [blob, setBlob] = useState<Blob>();
	const url = useMemo(() => (blob ? URL.createObjectURL(blob) : undefined), [blob]);
	const audioState = useMemo<{ audioData?: Float32Array }>(() => ({}), []);

	useEffect(() => {
		const arr: Float32Array[] = [];
		let len = 0;
		recorder.subscribe(buffers => {
			arr.push(buffers[0]);
			len += buffers[0].length;
			if (arr.length % 33 === 0) {
				const result = mergeBuffers(arr, len);
				setAudioData(result);
				audioState.audioData = result;
			}
		});
	}, [recorder, audioState]);
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
		const { sampleRate } = audioContext;
		const b = await wavCoder.encode({ buffers, sampleRate });
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
				{audioData && <Waveform.View state={audioState} />}
			</div>
			<div className='Recorder__Content'>
				<Frequency.View mediaStream={mediaStream} />
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
