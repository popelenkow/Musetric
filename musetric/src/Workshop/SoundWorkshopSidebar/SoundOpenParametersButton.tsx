import React, { FC } from 'react';
import { useSoundWorkshopContext } from '../SoundWorkshopContext';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundOpenParametersButtonProps = object;
export const SoundOpenParametersButton: FC<SoundOpenParametersButtonProps> = () => {
	const { ParametersIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const [state, dispatch] = useSoundWorkshopContext();
	const { isOpenParameters } = state;

	const openParametersButton: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:parameters'),
		active: isOpenParameters,
		onClick: () => dispatch({ type: 'setIsOpenParameters', isOpenParameters: !isOpenParameters }),
	};
	return (
		<Button {...openParametersButton}>
			<ParametersIcon />
		</Button>
	);
};
