import React from 'react';
import { createClasses, createUseClasses } from '../../../App/AppCss';
import { TopLoader } from '../../../Controls/TopLoader';
import { SFC } from '../../../UtilityTypes/React';
import { skipPromise } from '../../../Utils/SkipPromise';
import { useLoopCallback } from '../../../UtilsReact/Loop';
import { KaraokeSnapshot, useKaraokeStore } from '../../KaraokeContext';
import { MusicListItem, MusicListItemProps } from './Item';

export const getMusicListPanelClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			background: theme.backgroundPanel,
			'box-sizing': 'border-box',
			height: '100%',
			width: '100%',
			position: 'relative',
		},
		list: {
			display: 'flex',
			'flex-direction': 'column',
		},
		item: {
			display: 'flex',
			'flex-direction': 'row',
			width: '100%',
		},
		itemId: {
			width: '100%',
			'text-align': 'left',
		},
		itemProgress: {
			width: '30px',
		},
	};
});
const useClasses = createUseClasses('MusicListPanel', getMusicListPanelClasses);

const select = ({
	isOpenMusicList,
	musicList,
	selectedId,
	selectTrack,
	removeTrack,
	isMusicListLoading,
	refreshMusicList,
}: KaraokeSnapshot) => ({
	isOpenMusicList,
	musicList,
	selectedId,
	selectTrack,
	removeTrack,
	isMusicListLoading,
	refreshMusicList,
} as const);

export const MusicListPanel: SFC<object, { result: 'optional' }> = () => {
	const classes = useClasses();

	const {
		isOpenMusicList, musicList, selectedId, selectTrack, removeTrack,
		isMusicListLoading, refreshMusicList,
	} = useKaraokeStore(select);

	useLoopCallback(() => {
		skipPromise(refreshMusicList());
	}, 10_000);

	if (!isOpenMusicList) return null;

	return (
		<div className={classes.root}>
			{isMusicListLoading && <TopLoader />}
			<div className={classes.list}>
				{musicList.map((item) => {
					const musicItemProps: MusicListItemProps = {
						item,
						selectedId,
						select: (id) => skipPromise(selectTrack(id)),
						remove: (id) => skipPromise(removeTrack(id)),
					};
					return <MusicListItem key={item.id} {...musicItemProps} />;
				})}
			</div>
		</div>
	);
};
