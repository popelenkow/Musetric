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
			navigator.mediaDevices.getUserMedia({
				audio: true
			}).then((stream) => {
				const recorder = new MediaRecorder(stream);
				recorder.ondataavailable = (e) => {
					var url = URL.createObjectURL(e.data);
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

		return (
		<div>
			{ (recorder && recorder.state == 'recording') && <button onClick={stop}>stop</button> }
			{ (!recorder || recorder.state != 'recording') && <button onClick={record}>record</button>}
			{ list.map(x => <audio key={x} controls={true} src={x}></audio>) }
		</div>
		)
	}
}