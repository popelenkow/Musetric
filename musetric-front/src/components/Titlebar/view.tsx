import './styles.scss'
import React from 'react'
import i18n from 'i18next'
import { TitlebarProps, TitlebarState } from './types';
import { remote } from 'electron'

const win = remote.getCurrentWindow();


export class TitlebarView extends React.Component<TitlebarProps, TitlebarState> {
	constructor(props: TitlebarProps) {
		super(props);
		this.state = { isMaximized: win.isMaximized() }
	}

	render() {
		const isMaximized = this.state.isMaximized;
		const maximizeBtn = (
		<button className="title-btn maximize" onClick={() => { win.maximize(); this.setState({ isMaximized: !isMaximized }) }}>
			<svg viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
		</button>);
		const unmaximizeBtn = (
		<button className="title-btn unmaximize" onClick={() =>  { win.unmaximize(); this.setState({ isMaximized: !isMaximized }) }}>
			<svg viewBox="0 0 10.2 10.1"><path d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z" /></svg>
		</button>);

		return (
		<div className='titlebar'>
			<div className="title-text">Musetric</div>
			<div className="title-controls">
				<button className="title-btn minimize" onClick={() => win.minimize()}>
					<svg x="0px" y="0px" viewBox="0 0 10.2 1"><rect x="0" y="50%" width="10.2" height="1" /></svg>
				</button>
				{isMaximized ? unmaximizeBtn : maximizeBtn} 
				<button className="title-btn close" onClick={() => win.close()}>
					<svg viewBox="0 0 10 10"><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" /></svg>
				</button>
			</div>
		</div>)
	}
}