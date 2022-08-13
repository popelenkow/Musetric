import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';

export type SoundOpenParametersButtonProps = {
	isOpenParameters: boolean,
	setIsOpenParameters: (value: boolean) => void,
};
export const SoundOpenParametersButton: SFC<SoundOpenParametersButtonProps> = (props) => {
	const { isOpenParameters, setIsOpenParameters } = props;

	const { ParametersIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const openParametersButton: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:parameters'),
		active: isOpenParameters,
		onClick: () => setIsOpenParameters(!isOpenParameters),
	};
	return (
		<Button {...openParametersButton}>
			<ParametersIcon />
		</Button>
	);
};
SoundOpenParametersButton.displayName = 'SoundOpenParametersButton';
