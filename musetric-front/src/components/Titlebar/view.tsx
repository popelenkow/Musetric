import './styles.scss'
import React from 'react'
import i18n from 'i18next'
import { TitlebarProps, TitlebarState } from './types';
import { remote } from 'electron'
import { icons } from '../../icons';

const win = remote.getCurrentWindow();

const app = document.getElementById("app");

const changeTheme = () => {

	let isWhite = true;
	app?.classList.forEach(x => {
		if (x == 'dark-theme') isWhite = false;
		app.classList.remove(x);
	})
	app?.classList.add(isWhite ? 'dark-theme' : 'white-theme')
}


export class TitlebarView extends React.Component<TitlebarProps, TitlebarState> {
	constructor(props: TitlebarProps) {
		super(props);
		this.state = { isMaximized: win.isMaximized(), isDark: props.theme == 'dark' }
	}

	setTheme(isDark: boolean) {
		this.props.setTheme(isDark ? 'dark' : 'white')
		this.setState({ isDark })
	}

	render() {
		const { isDark, isMaximized } = this.state;
		const maximize = () => {
			isMaximized ? win.unmaximize() : win.maximize();
			this.setState({ isMaximized: !isMaximized })
		}

		return (
		<div className='titlebar'>
			<div className="title-text">Musetric</div>
			<button className='title-btn' onClick={() => this.setTheme(!isDark)}>
					{isDark ? 'dark' : 'white'}
			</button>
			<div className="title-controls">
				<button className="title-btn" onClick={() => win.minimize()}>
					{icons.titlebar.minimize}
				</button>
				<button className="title-btn" onClick={maximize}>
					{isMaximized ? icons.titlebar.unmaximize : icons.titlebar.maximize}
				</button>
				<button className="title-btn close" onClick={() => win.close()}>
					{icons.titlebar.close}
				</button>
			</div>
		</div>)
	}
}