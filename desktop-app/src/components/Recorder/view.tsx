import React from 'react'
import { Props, State } from './types';
import { initAudio } from  './model';

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { list: [] }
	}
	componentDidMount() {
		
		window.addEventListener('load', initAudio );
	}
	
	render() {
		return (
		<>
			<div id="viz">
				<canvas id="analyser" width="1024" height="500"></canvas>
				<canvas id="wavedisplay" width="1024" height="500"></canvas>
			</div>
			<div id="controls">
				<button id="record">start</button>
				<a id="save" href="#">save</a>
			</div>
		</>
		)
	}
}