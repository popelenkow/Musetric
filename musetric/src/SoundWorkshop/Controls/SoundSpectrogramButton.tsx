import React, { ReactElement } from 'react';
import { SoundViewId } from '../Store';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundSpectrogramButtonProps = {
	soundViewId: SoundViewId,
	setSoundViewId: (value: SoundViewId) => void,
};
export function SoundSpectrogramButton(
	props: SoundSpectrogramButtonProps,
): ReactElement {
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
}
