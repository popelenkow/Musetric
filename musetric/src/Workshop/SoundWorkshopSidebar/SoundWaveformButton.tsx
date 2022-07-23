import React, { FC } from 'react';
import { useSoundWorkshopContext } from '../SoundWorkshopContext';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundWaveformButtonProps = object;
export const SoundWaveformButton: FC<SoundWaveformButtonProps> = () => {
	const { WaveformIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const [state, dispatch] = useSoundWorkshopContext();
	const { soundViewId } = state;

	const waveformButtonProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:waveform'),
		primary: soundViewId === 'Waveform',
		onClick: () => dispatch({ type: 'setSoundViewId', soundViewId: 'Waveform' }),
	};
	return (
		<Button {...waveformButtonProps}>
			<WaveformIcon />
		</Button>
	);
};
