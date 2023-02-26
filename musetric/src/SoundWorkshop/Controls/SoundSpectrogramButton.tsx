import React from 'react';
import { useIconContext } from '../../AppContexts/Icon';
import { useLocaleContext } from '../../AppContexts/Locale';
import { Button, ButtonProps } from '../../Controls/Button';
import { SFC } from '../../UtilityTypes/React';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

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
