import { SeparationTaskInfo } from 'musetric-api/SeparationTaskInfo';
import React from 'react';
import { createClasses, createUseClasses } from '../../../App/AppCss';
import { Button, ButtonProps } from '../../../Controls/Button';
import { Icon } from '../../../Controls/Icon';
import { SFC } from '../../../UtilityTypes/React';

export const getMusicListItemClasses = createClasses(() => {
	return {
		root: {
			display: 'flex',
			'flex-direction': 'row',
			width: '100%',
		},
		id: {
			width: '100%',
			'text-align': 'left',
		},
		progress: {
			display: 'flex',
			'flex-direction': 'row',
			gap: '6px',
		},
	};
});
const useClasses = createUseClasses('MusicListItem', getMusicListItemClasses);

export type MusicListItemProps = {
	item: SeparationTaskInfo,
	selectedId?: string,
	select: (id: string) => void,
	remove: (id: string) => void,
};
export const MusicListItem: SFC<MusicListItemProps> = (props) => {
	const { item, selectedId, select, remove } = props;
	const classes = useClasses();

	const selectProps: ButtonProps = {
		onClick: () => select(item.id),
		kind: 'full',
		align: 'left',
		primary: selectedId === item.id,
	};

	const removeProps: ButtonProps = {
		onClick: () => remove(item.id),
		kind: 'icon',
		primary: selectedId === item.id,
	};

	return (
		<div className={classes.root}>
			<Button {...selectProps}>
				<div className={classes.id}>
					{item.id}
				</div>
				<div className={classes.progress}>
					<div>{item.chunksDone.length}</div>
					<div>/</div>
					<div>{item.chunksCount}</div>
				</div>
			</Button>
			<Button {...removeProps}>
				<Icon name='remove' />
			</Button>
		</div>
	);
};
