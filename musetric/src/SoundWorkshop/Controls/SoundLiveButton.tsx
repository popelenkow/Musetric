import React, { ReactElement } from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';

export type SoundLiveButtonProps = {
	isLive: boolean,
	setIsLive: (value: boolean) => void,
};
export function SoundLiveButton(
	props: SoundLiveButtonProps,
): ReactElement {
	const { isLive, setIsLive } = props;

	const { LiveIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const liveProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:live'),
		primary: isLive,
		onClick: () => setIsLive(!isLive),
	};
	return (
		<Button {...liveProps}>
			<LiveIcon />
		</Button>
	);
}
