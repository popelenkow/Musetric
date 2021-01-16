/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import { AudioDevices } from '../..';
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
	device: AudioDevices.RecorderDevice;
	drop: () => void;
};

export const RecorderView: React.FC<RecorderProps> = (props) => {
	const { device, drop } = props;
	const { mediaStream, audioContext, recorder, wavCoder } = device;

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
				{isRecording
					? <button type='button' className='Button' onClick={stop}>stop</button>
					: <button type='button' className='Button' onClick={start}>start</button>}
				<button type='button' className='Button' onClick={saveAudio}>save</button>
				<button type='button' className='Button' onClick={drop}>drop</button>
			</div>
			<div className='RecorderContent'>
				<div className='RecorderContent__View'>
					{url && <audio className='recorder-item' key={url} controls src={url} />}
				</div>
				<div className='RecorderContent__View'>
					{audioData && <Waveform.View state={audioState} />}
				</div>
				<div className='RecorderContent__View'>
					<Frequency.View mediaStream={mediaStream} />
				</div>
			</div>
		</div>
	);
};

export type Props = {
};

export const View: React.FC<Props> = () => {
	const [device, setDevice] = useState<AudioDevices.RecorderDevice>();

	const init = async () => {
		const value = await AudioDevices.createRecorderDevice();
		setDevice(value);
	};

	return (device
		? <RecorderView device={device} drop={() => setDevice(undefined)} />
		: <button type='button' className='Button' style={{ width: '100%', height: '100%' }} onClick={init}>init</button>
	);
};
