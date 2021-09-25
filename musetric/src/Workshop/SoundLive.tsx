import React, { useState, FC } from 'react';
import { useIconContext } from '../AppContexts/Icon';
import { Checkbox, CheckboxProps } from '../Controls/Checkbox';

export type SoundLive = {
	isLive: boolean;
	LiveCheckbox: FC;
};
export const useSoundLive = (): SoundLive => {
	const { LiveIcon } = useIconContext();

	const [isLive, setIsLive] = useState<boolean>(false);

	const liveProps: CheckboxProps = {
		checked: isLive,
		onToggle: () => setIsLive(!isLive),
	};

	const LiveCheckbox: FC = () => <Checkbox {...liveProps}><LiveIcon /></Checkbox>;

	return { isLive, LiveCheckbox };
};
