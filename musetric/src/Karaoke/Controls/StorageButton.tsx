import React from 'react';
import { useAppLocale } from '../../App/AppContext';
import { Button, ButtonProps } from '../../Controls/Button';
import { Icon } from '../../Controls/Icon';
import { SFC } from '../../UtilityTypes/React';
import { KaraokeSnapshot, useKaraokeStore } from '../KaraokeContext';

const select = ({
	isOpenMusicList, setIsOpenSoundList: setIsOpenMusicList,
}: KaraokeSnapshot) => ({
	isOpenMusicList, setIsOpenMusicList,
} as const);

export const StorageButton: SFC = () => {
	const { i18n } = useAppLocale();

	const { isOpenMusicList, setIsOpenMusicList } = useKaraokeStore(select);

	const openMusicList: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Karaoke:open'),
		onClick: () => setIsOpenMusicList(!isOpenMusicList),
		primary: isOpenMusicList,
	};
	return (
		<Button {...openMusicList}>
			<Icon name='storage' />
		</Button>
	);
};
