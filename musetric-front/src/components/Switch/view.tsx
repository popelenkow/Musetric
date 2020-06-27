import React from 'react'
import { SwitchProps, SwitchState } from './types';

export class SwitchView<T> extends React.Component<SwitchProps<T>, SwitchState<T>> {
	constructor(props: SwitchProps<T>) {
		super(props);
		this.state = { id: this.props.currentId }
	}

	render() {
		const { id } = this.state;
		const { ids, localize, set, className } = this.props;
		const next = () => {
			let index = ids.indexOf(id)
			index = (index + 1) % this.props.ids.length
			const newId = ids[index]
			this.setState({ id: newId })
			set(newId)
		}
		return (
		<button className={className} onClick={next}>
			{localize ? localize(id) : id}
		</button>
		)
	}
}