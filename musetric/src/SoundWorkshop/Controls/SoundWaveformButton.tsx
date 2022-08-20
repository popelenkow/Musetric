import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { SoundViewId } from '../Store';

export type SoundWaveformButtonProps = {
	soundViewId: SoundViewId,
	setSoundViewId: (value: SoundViewId) => void,
};
export const SoundWaveformButton: SFC<SoundWaveformButtonProps> = (props) => {
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
};
SoundWaveformButton.displayName = 'SoundWaveformButton';
