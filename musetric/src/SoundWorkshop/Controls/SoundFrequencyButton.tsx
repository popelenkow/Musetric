import React, { ReactElement } from 'react';
import { SoundViewId } from '../Store';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundFrequencyButtonProps = {
	soundViewId: SoundViewId,
	setSoundViewId: (value: SoundViewId) => void,
};
export function SoundFrequencyButton(props: SoundFrequencyButtonProps): ReactElement {
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
}
