import React, { useState } from 'react';

import {
	Checkbox, CheckboxProps, LiveIcon,
} from '..';

export type UseSoundLiveProps = {
};

export const useSoundLive = () => {
	const [isLive, setIsLive] = useState<boolean>(false);

	const liveProps: CheckboxProps = {
		checked: isLive,
		onToggle: () => setIsLive(!isLive),
	};

	const liveCheckbox = <Checkbox {...liveProps}><LiveIcon /></Checkbox>;

	return { isLive, liveCheckbox };
};
