import React from 'react'
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
		const { isMaximized } = this.state;
		const maximize = () => {
			isMaximized ? win.unmaximize() : win.maximize();
			this.setState({ isMaximized: !isMaximized })
		}

		return (
		<div className='titlebar'>
			<div className="title-text">Musetric</div>
			{this.props.children}
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