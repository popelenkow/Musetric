import React, { ReactElement } from 'react';
import { SoundViewId } from '../Store';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundWaveformButtonProps = {
	soundViewId: SoundViewId,
	setSoundViewId: (value: SoundViewId) => void,
};
export function SoundWaveformButton(
	props: SoundWaveformButtonProps,
): ReactElement {
	const { soundViewId, setSoundViewId } = props;

	const { WaveformIcon } = useIconContext();
	const { i18n } = useLocaleContext();
	const waveformButtonProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:waveform'),
		primary: soundViewId === 'Waveform',
		onClick: () => setSoundViewId('Waveform'),
	};
	return (
		<Button {...waveformButtonProps}>
			<WaveformIcon />
		</Button>
	);
}
