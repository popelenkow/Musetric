/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from 'react';

export type Props = {
};

export const View: React.FC<Props> = () => {
	const [recorder, setRecorder] = useState<MediaRecorder>();
	const [list, setList] = useState<string[]>([]);

	const record = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const recorderN = new MediaRecorder(stream);
		recorderN.ondataavailable = (event) => {
			const url = URL.createObjectURL(event.data);
			const g = [...list, url];
			setList(g);
		};
		recorderN.start();
		setRecorder(recorderN);
	};

	const stop = () => {
		if (recorder) {
			recorder.stop();
			recorder.stream.getAudioTracks()[0].stop();
			setRecorder(recorder);
		}
	};

	const isRecording = recorder && recorder.state === 'recording';
	return (
		<div className='recorder'>
			<div className='recorder-header'>
				{ isRecording && <button type='button' className='Button' onClick={stop}>stop</button> }
				{ !isRecording && <button type='button' className='Button' onClick={record}>record</button> }
			</div>
			<div className='recorder-board'>
				{ list.map(x => <audio className='recorder-item' key={x} controls src={x} />) }
			</div>
		</div>
	);
};
