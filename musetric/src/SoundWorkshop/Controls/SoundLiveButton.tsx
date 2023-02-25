import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { skipPromise } from '../../Utils';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../Store';

const select = ({
	isLive, setIsLive, getRecorder,
}: SoundWorkshopSnapshot) => ({
	isLive, setIsLive, getRecorder,
} as const);

export const SoundLiveButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { isLive, setIsLive, getRecorder } = store;

	const { LiveIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const liveProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:live'),
		primary: isLive,
		onClick: () => {
			setIsLive(!isLive);
			skipPromise(getRecorder());
		},
	};
	return (
		<Button {...liveProps}>
			<LiveIcon />
		</Button>
	);
};
