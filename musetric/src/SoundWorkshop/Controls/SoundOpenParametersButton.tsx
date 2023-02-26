import React from 'react';
import { useIconContext } from '../../AppContexts/Icon';
import { useLocaleContext } from '../../AppContexts/Locale';
import { Button, ButtonProps } from '../../Controls/Button';
import { SFC } from '../../UtilityTypes/React';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

const select = ({
	isOpenParameters, setIsOpenParameters,
}: SoundWorkshopSnapshot) => ({
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
