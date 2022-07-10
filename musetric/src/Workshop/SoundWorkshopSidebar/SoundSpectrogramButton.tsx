import React, { FC } from 'react';
import { useSoundWorkshopContext } from '../SoundWorkshopContext';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundSpectrogramButtonProps = object;
export const SoundSpectrogramButton: FC<SoundSpectrogramButtonProps> = () => {
	const { SpectrogramIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const [state, dispatch] = useSoundWorkshopContext();
	const { soundViewId } = state;

	const spectrogramButtonProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:spectrogram'),
		primary: soundViewId === 'Spectrogram',
		onClick: () => dispatch({ type: 'setSoundViewId', soundViewId: 'Spectrogram' }),
	};
	return (
		<Button {...spectrogramButtonProps}>
			<SpectrogramIcon />
		</Button>
	);
};
