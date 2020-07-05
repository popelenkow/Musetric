import React from 'react'
import { TitlebarProps, TitlebarState } from './types';
import { ipcRenderer } from 'electron'
import { icons } from '../../icons';
import { WindowEvent, channels } from '../../channels';


export class TitlebarView extends React.Component<TitlebarProps, TitlebarState> {
	constructor(props: TitlebarProps) {
		super(props);
		this.state = { isMaximized: false }
	}

	componentDidMount() {
		ipcRenderer
			.invoke(channels.pytest)
			.then(value => console.log(value))
			.catch(err => console.log(err))
		ipcRenderer.on(channels.onMaximizeWindow, (_, isMaximized) => {
			this.setState({ isMaximized: isMaximized })
		});	
	}

	render() {
		const { isMaximized } = this.state;
		const sendMain = (event: WindowEvent) => ipcRenderer.invoke(channels.mainWindow, event);

		return (
		<div className='titlebar'>
			<div className="titlebar-icon">{icons.app}</div>
			<div className="titlebar-text">Musetric</div>
			{this.props.children}
			<div className="titlebar-controls">
				<button className="windows-btn" onClick={() => sendMain('minimize')}>
					{icons.titlebar.minimize}
				</button>
				<button className="windows-btn" onClick={() => isMaximized ? sendMain('unmaximize') : sendMain('maximize')}>
					{isMaximized ? icons.titlebar.unmaximize : icons.titlebar.maximize}
				</button>
				<button className="windows-close-btn" onClick={() => sendMain('close')}>
					{icons.titlebar.close}
				</button>
			</div>
		</div>)
	}
}