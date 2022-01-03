import React, { useState } from 'react';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { Button, ButtonProps } from '../Controls/Button';

export const useSoundLive = () => {
	const { LiveIcon } = useIconContext();
	const { t } = useLocaleContext();

	const [isLive, setIsLive] = useState<boolean>(false);

	const renderLiveButton = () => {
		const liveProps: ButtonProps = {
			kind: 'icon',
			rounded: true,
			title: t('Workshop:live'),
			primary: isLive,
			onClick: () => setIsLive(!isLive),
		};
		return (
			<Button {...liveProps}>
				<LiveIcon />
			</Button>
		);
	};

	return {
		isLive,
		renderLiveButton,
	};
};
