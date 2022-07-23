import React, { FC } from 'react';
import { useSoundWorkshopContext } from '../SoundWorkshopContext';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundFrequencyButtonProps = object;
export const SoundFrequencyButton: FC<SoundFrequencyButtonProps> = () => {
	const { FrequencyIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const [state, dispatch] = useSoundWorkshopContext();
	const { soundViewId } = state;

	const frequencyButtonProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:frequency'),
		primary: soundViewId === 'Frequency',
		onClick: () => dispatch({ type: 'setSoundViewId', soundViewId: 'Frequency' }),
	};
	return (
		<Button {...frequencyButtonProps}>
			<FrequencyIcon />
		</Button>
	);
};
