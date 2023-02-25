import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../Store';

const select = ({
	soundViewId, setSoundViewId,
}: SoundWorkshopSnapshot) => ({
	soundViewId, setSoundViewId,
} as const);

export const SoundFrequencyButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { soundViewId, setSoundViewId } = store;

	const { FrequencyIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const frequencyButtonProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:frequency'),
		primary: soundViewId === 'Frequency',
		onClick: () => setSoundViewId('Frequency'),
	};
	return (
		<Button {...frequencyButtonProps}>
			<FrequencyIcon />
		</Button>
	);
};
