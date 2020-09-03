/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-shadow */
import React from 'react';
import { Props, State } from './types';

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { list: [] };
	}

	render() {
		const { recorder, list } = this.state;
		const record = async () => {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream);
			recorder.ondataavailable = (event) => {
				const url = URL.createObjectURL(event.data);
				const { list } = this.state;
				const g = [...list, url];
				this.setState({ list: g });
			};
			recorder.start();
			this.setState({ recorder });
		};

		const stop = () => {
			if (recorder) {
				recorder.stop();
				recorder.stream.getAudioTracks()[0].stop();
				this.setState({ recorder });
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
	}
}
