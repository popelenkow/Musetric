import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../Store';

const select = ({
	soundViewId, setSoundViewId,
}: SoundWorkshopSnapshot) => ({
	soundViewId, setSoundViewId,
} as const);

export const SoundSpectrogramButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { soundViewId, setSoundViewId } = store;

	const { SpectrogramIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const spectrogramButtonProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:spectrogram'),
		primary: soundViewId === 'Spectrogram',
		onClick: () => setSoundViewId('Spectrogram'),
	};
	return (
		<Button {...spectrogramButtonProps}>
			<SpectrogramIcon />
		</Button>
	);
};
