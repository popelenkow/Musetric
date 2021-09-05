import React, { useContext, createContext, FC } from 'react';
import { Icons } from '../AppBase/Icon';

export type IconStore = Icons;
const defaultIconStore: IconStore = {
	AppIcon: () => null,
	CloseIcon: () => null,
	FrequencyIcon: () => null,
	GithubIcon: () => null,
	InfoIcon: () => null,
	LiveIcon: () => null,
	MenuIcon: () => null,
	OpenFileIcon: () => null,
	PerformanceIcon: () => null,
	PlayIcon: () => null,
	RecordIcon: () => null,
	SaveIcon: () => null,
	SpectrogramIcon: () => null,
	StopIcon: () => null,
	WaveformIcon: () => null,
};
export const IconContext = createContext<IconStore>(defaultIconStore);

export const IconConsumer = IconContext.Consumer;

export type IconProviderProps = {
	icons: Icons;
};

export const IconProvider: FC<IconProviderProps> = (props) => {
	const { children, icons } = props;

	const store: IconStore = { ...icons };

	return (
		<IconContext.Provider value={store}>
			{children}
		</IconContext.Provider>
	);
};

export const useIconContext = () => useContext(IconContext);
