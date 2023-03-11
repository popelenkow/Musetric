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

export const SoundSpectrogramButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { soundViewId, setSoundViewId } = store;

	const { i18n } = useAppLocale();

	const spectrogramButtonProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:spectrogram'),
		primary: soundViewId === 'Spectrogram',
		onClick: () => setSoundViewId('Spectrogram'),
	};
	return (
		<Button {...spectrogramButtonProps}>
			<Icon name='spectrogram' />
		</Button>
	);
};
