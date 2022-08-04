import React, { ReactElement } from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundOpenParametersButtonProps = {
	isOpenParameters: boolean,
	setIsOpenParameters: (value: boolean) => void,
};
export function SoundOpenParametersButton(
	props: SoundOpenParametersButtonProps,
): ReactElement {
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
}
