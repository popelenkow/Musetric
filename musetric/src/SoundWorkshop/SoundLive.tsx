import React, { useState, FC } from 'react';
import { useIconContext } from '../AppContexts/IconContext';
import { Checkbox, CheckboxProps } from '../Controls/Checkbox';

export type UseSoundLiveProps = {
};

export const useSoundLive = () => {
	const { LiveIcon } = useIconContext();

	const [isLive, setIsLive] = useState<boolean>(false);

	const liveProps: CheckboxProps = {
		checked: isLive,
		onToggle: () => setIsLive(!isLive),
	};

	const LiveCheckbox: FC = () => <Checkbox {...liveProps}><LiveIcon /></Checkbox>;

	return { isLive, LiveCheckbox };
};
