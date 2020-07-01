import React from 'react'
import { SwitchProps, SwitchState } from './types';
import { withTranslation, WithTranslation } from 'react-i18next';

class SwitchView extends React.Component<SwitchProps & WithTranslation, SwitchState> {
	constructor(props: SwitchProps & WithTranslation) {
		super(props);
		this.state = { id: this.props.currentId }
	}

	render() {
		const { id } = this.state;
		const { t, ids, localize, set, className } = this.props;
		const next = () => {
			let index = ids.indexOf(id)
			index = (index + 1) % this.props.ids.length
			const newId = ids[index]
			this.setState({ id: newId })
			set(newId)
		}
		return (
		<button className={className} onClick={next}>
			{localize ? localize(id, t) : id}
		</button>)
	}
}

const view = withTranslation()(SwitchView)
export { view as SwitchView }