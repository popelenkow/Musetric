import React, { FC } from 'react';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { Button, ButtonProps } from '../Controls/Button';
import { useSoundWorkshopContext } from './SoundWorkshopContext';

export type SoundLiveButtonProps = object;
export const SoundLiveButton: FC<SoundLiveButtonProps> = () => {
	const { LiveIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const [state, dispatch] = useSoundWorkshopContext();
	const { isLive } = state;

	const liveProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:live'),
		primary: isLive,
		onClick: () => dispatch({ type: 'setIsLive', isLive: !isLive }),
	};
	return (
		<Button {...liveProps}>
			<LiveIcon />
		</Button>
	);
};
