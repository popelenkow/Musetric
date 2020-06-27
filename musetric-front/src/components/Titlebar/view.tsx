import './styles.scss'
import React from 'react'
import i18n from 'i18next'
import { TitlebarProps, TitlebarState } from './types';
import { remote } from 'electron'
import { icons } from '../../icons';
import { Theme } from '../../types';

const win = remote.getCurrentWindow();

export class TitlebarView extends React.Component<TitlebarProps, TitlebarState> {
	constructor(props: TitlebarProps) {
		super(props);
		this.state = { isMaximized: win.isMaximized(), theme: props.theme.value }
	}

	setTheme(theme: Theme) {
		this.props.theme.set(theme)
		this.setState({ theme })
	}

	render() {
		const { theme, isMaximized } = this.state;
		const maximize = () => {
			isMaximized ? win.unmaximize() : win.maximize();
			this.setState({ isMaximized: !isMaximized })
		}

		return (
		<div className='titlebar'>
			<div className="title-text">Musetric</div>
			<button className='title-btn' onClick={() => this.setTheme(this.props.theme.next(theme))}>
					{this.props.theme.localize(theme)}
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