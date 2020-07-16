import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from "i18next";

export type Props<T = any> = {
	currentId: T;
	ids: T[];
	set: (id: T) => void;
	className?: string;
	localize?: (id: T, t: TFunction) => string;
};

export type State<T = any> = {
	id: T;
};

class View extends React.Component<Props & WithTranslation, State> {
	constructor(props: Props & WithTranslation) {
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

const view = withTranslation()(View)
export { view as View }