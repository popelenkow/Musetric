import React from 'react';
import { useAppLocale } from '../../App/AppContext';
import { Button, ButtonProps } from '../../Controls/Button';
import { Icon } from '../../Controls/Icon';
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

	const { i18n } = useAppLocale();
	const waveformButtonProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:waveform'),
		primary: soundViewId === 'Waveform',
		onClick: () => setSoundViewId('Waveform'),
	};
	return (
		<Button {...waveformButtonProps}>
			<Icon name='waveform' />
		</Button>
	);
};
