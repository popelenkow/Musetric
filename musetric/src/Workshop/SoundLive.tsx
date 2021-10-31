import React, { useState, ReactElement } from 'react';
import { useIconContext } from '../AppContexts/Icon';
import { Checkbox, CheckboxProps } from '../Controls/Checkbox';

export type SoundLive = {
	isLive: boolean;
	renderLiveCheckbox: () => ReactElement;
};
export const useSoundLive = (): SoundLive => {
	const { LiveIcon } = useIconContext();

	const [isLive, setIsLive] = useState<boolean>(false);

	const liveProps: CheckboxProps = {
		checked: isLive,
		onToggle: () => setIsLive(!isLive),
		rounded: true,
	};

	return {
		isLive,
		renderLiveCheckbox: () => (
			<Checkbox {...liveProps}>
				<LiveIcon />
			</Checkbox>
		),
	};
};
