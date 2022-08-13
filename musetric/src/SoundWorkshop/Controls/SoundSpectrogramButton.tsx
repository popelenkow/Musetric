import React from 'react';
import { SoundViewId } from '../Store';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';

export type SoundSpectrogramButtonProps = {
	soundViewId: SoundViewId,
	setSoundViewId: (value: SoundViewId) => void,
};
export const SoundSpectrogramButton: SFC<SoundSpectrogramButtonProps> = (props) => {
	const { soundViewId, setSoundViewId } = props;

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
SoundSpectrogramButton.displayName = 'SoundSpectrogramButton';
