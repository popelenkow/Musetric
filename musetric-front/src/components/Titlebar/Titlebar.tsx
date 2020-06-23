import './Titlebar.scss'
import React from 'react'
import i18n from 'i18next'
import { TitlebarProps, TitlebarState } from './types';

export class Titlebar extends React.Component<TitlebarProps, TitlebarState> {
	constructor(props: TitlebarProps) {
		super(props);
	}

	render() {
		return (
		<div className='titlebar'>

		</div>)
	}
}