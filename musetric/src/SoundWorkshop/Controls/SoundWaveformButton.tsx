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

export const SoundWaveformButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { soundViewId, setSoundViewId } = store;

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
