import React from 'react';
import { useAppLocale } from '../../App/AppContext';
import { Button, ButtonProps } from '../../Controls/Button';
import { Icon } from '../../Controls/Icon';
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

	const { i18n } = useAppLocale();

	const openParametersButton: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:parameters'),
		primary: isOpenParameters,
		onClick: () => setIsOpenParameters(!isOpenParameters),
	};
	return (
		<Button {...openParametersButton}>
			<Icon name='parameters' />
		</Button>
	);
};
