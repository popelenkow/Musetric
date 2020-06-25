import './styles.scss'
import React from 'react'
import i18n from 'i18next'
import { TitlebarProps, TitlebarState } from './types';
import { remote } from 'electron'
import { icons } from '../../icons';

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
			{icons.titlebar.maximize}
		</button>);
		const unmaximizeBtn = (
		<button className="title-btn unmaximize" onClick={() =>  { win.unmaximize(); this.setState({ isMaximized: !isMaximized }) }}>
			{icons.titlebar.unmaximize}
		</button>);

		return (
		<div className='titlebar'>
			<div className="title-text">Musetric</div>
			<div className="title-controls">
				<button className="title-btn minimize" onClick={() => win.minimize()}>
					{icons.titlebar.minimize}
				</button>
				{isMaximized ? unmaximizeBtn : maximizeBtn} 
				<button className="title-btn close" onClick={() => win.close()}>
					{icons.titlebar.close}
				</button>
			</div>
		</div>)
	}
}