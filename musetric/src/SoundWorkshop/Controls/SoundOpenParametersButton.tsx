import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const {
		isOpenParameters,
		setIsOpenParameters,
	} = store;
	return {
		isOpenParameters,
		setIsOpenParameters,
	};
};

export const SoundOpenParametersButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { isOpenParameters, setIsOpenParameters } = store;

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
