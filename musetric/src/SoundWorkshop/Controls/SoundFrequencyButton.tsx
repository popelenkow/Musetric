import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { SoundViewId } from '../Store';

export type SoundFrequencyButtonProps = {
	soundViewId: SoundViewId,
	setSoundViewId: (value: SoundViewId) => void,
};
export const SoundFrequencyButton: SFC<SoundFrequencyButtonProps> = (props) => {
	const { soundViewId, setSoundViewId } = props;

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