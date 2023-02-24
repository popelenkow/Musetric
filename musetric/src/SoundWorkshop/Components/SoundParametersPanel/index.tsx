import React from 'react';
import { createUseClasses, createClasses } from '../../../AppContexts/Css';
import { ScrollArea } from '../../../Controls/ScrollArea';
import { TextField, TextFieldProps } from '../../../Controls/TextField';
import { SFC } from '../../../UtilityTypes';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../../Store';
import { FrequencyRangeParameter } from './frequency';

export const getSoundParametersClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			background: theme.activeBackground,
			'box-sizing': 'border-box',
			'border-top': `1px solid ${theme.divider}`,
			height: '100%',
			width: '100%',
		},
		list: {
			padding: '15px',
			display: 'flex',
			'flex-direction': 'column',
			'row-gap': '15px',
		},
	};
});
const useClasses = createUseClasses('SoundParameters', getSoundParametersClasses);

const SoundParametersPanel: SFC = () => {
	const classes = useClasses();

	const textFieldProps: TextFieldProps = {
		value: 'qwe',
		label: 'text',
		rounded: true,
	};
	return (
		<div className={classes.root}>
			<ScrollArea>
				<div className={classes.list}>
					<FrequencyRangeParameter />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
				</div>
			</ScrollArea>
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const { isOpenParameters } = store;
	return {
		isOpenParameters,
	};
};

const WithHidden: SFC<object, 'none', 'optional'> = () => {
	const store = useSoundWorkshopStore(select);
	const { isOpenParameters } = store;

	if (!isOpenParameters) return null;
	return <SoundParametersPanel />;
};

export {
	WithHidden as SoundParametersPanel,
};
