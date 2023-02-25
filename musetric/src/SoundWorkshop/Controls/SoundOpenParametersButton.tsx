import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

const select = ({
	isOpenParameters, setIsOpenParameters,
}: SoundWorkshopStore) => ({
	isOpenParameters, setIsOpenParameters,
} as const);

export const SoundOpenParametersButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { isOpenParameters, setIsOpenParameters } = store;

	const { ParametersIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const openParametersButton: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:parameters'),
		primary: isOpenParameters,
		onClick: () => setIsOpenParameters(!isOpenParameters),
	};
	return (
		<Button {...openParametersButton}>
			<ParametersIcon />
		</Button>
	);
};
