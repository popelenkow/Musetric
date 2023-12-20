import React from 'react';
import { SoundInfo } from '../../../Api/SoundInfo';
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
	info: SoundInfo,
	selectedId?: string,
	select: (id: string) => void,
	remove: (id: string) => void,
};
export const MusicListItem: SFC<MusicListItemProps> = (props) => {
	const { info, selectedId, select, remove } = props;
	const classes = useClasses();

	const selectProps: ButtonProps = {
		onClick: () => select(info.id),
		kind: 'full',
		align: 'left',
		primary: selectedId === info.id,
	};

	const removeProps: ButtonProps = {
		onClick: () => remove(info.id),
		kind: 'icon',
		primary: selectedId === info.id,
	};

	return (
		<div className={classes.root}>
			<Button {...selectProps}>
				<div className={classes.id}>
					{info.fileName}
				</div>
				<div className={classes.progress}>
					<div>{info.id}</div>
				</div>
			</Button>
			<Button {...removeProps}>
				<Icon name='remove' />
			</Button>
		</div>
	);
};
