import React, { useContext } from 'react';
import { Contexts, Types } from '../..';

export type Change = (index: number) => void;
export type Props = {
	className: string;
	getIndex: (contentId?: Types.ContentId) => number;
}

export const View: React.FC<Props> = (props) => {
	const { className, getIndex, children } = props;

	const { contentId } = useContext(Contexts.AppContext.Context);

	const index = getIndex(contentId);

	if (index === -1) {
		return <div>none</div>;
	}

	return (
		<div className={className}>
			{(children as any)[index]}
		</div>
	);
};
