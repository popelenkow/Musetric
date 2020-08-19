import React from 'react'
import { Props, State } from './types';
import { icons } from './icons';
import { ipc } from '../../ipc';

export class View extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { isMaximized: false }
	}

	componentDidMount() {
		ipc.onWindow.on((_event, arg) => {
			this.setState(arg)
		});	
	}

	render() {
		const { isMaximized } = this.state;

		return (
		<div className='Titlebar'>
			<div className="Titlebar__Icon">{icons.app}</div>
			<div className="Titlebar__Text">Musetric</div>
			{this.props.children}
			<div className="WindowsTitlebar">
				<button className="WindowsTitlebar__Button" onClick={() => ipc.titlebar.invoke('minimize')}>
					{icons.titlebar.minimize}
				</button>
				<button className="WindowsTitlebar__Button" onClick={() => isMaximized ? ipc.titlebar.invoke('unmaximize') : ipc.titlebar.invoke('maximize')}>
					{isMaximized ? icons.titlebar.unmaximize : icons.titlebar.maximize}
				</button>
				<button className="WindowsTitlebar__CloseButton" onClick={() => ipc.titlebar.invoke('close')}>
					{icons.titlebar.close}
				</button>
			</div>
		</div>)
	}
}