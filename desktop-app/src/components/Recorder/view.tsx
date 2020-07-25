import React from 'react'
import { Props, State } from './types';

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { list: [] }
	}

	render() {
		const { recorder, list } = this.state;
		const record = () => {
			navigator.mediaDevices
				.getUserMedia({audio: true})
				.then(stream => new MediaRecorder(stream))
				.then(recorder => {
					recorder.ondataavailable = (event) => {
						var url = URL.createObjectURL(event.data);
						const list = this.state.list;
						const g = [ ...list, url ];
						this.setState({ list: g })
					};
					recorder.start();
					this.setState({ recorder })
				});
		}

		const stop = () => {
			if (recorder) {
				recorder.stop();
				recorder.stream.getAudioTracks()[0].stop();
				this.setState({ recorder })
			}
		}

		const isRecording = recorder && recorder.state == 'recording';
		return (
		<div className='recorder'>
			<div className='recorder-header'>
				{ isRecording && <button className='btn' onClick={stop}>stop</button> }
				{ !isRecording && <button className='btn' onClick={record}>record</button>}
			</div>
			<div className='recorder-board'>
				{ list.map(x => <audio className='recorder-item' key={x} controls={true} src={x}></audio>) }
			</div>
		</div>
		)
	}
}