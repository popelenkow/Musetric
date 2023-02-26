import type { Icons } from 'musetric/AppBase/Icon';
import { AppIcon } from 'musetric/Resources/Icons/App';
import { CloseIcon } from 'musetric/Resources/Icons/Close';
import { DarkIcon } from 'musetric/Resources/Icons/Dark';
import { FrequencyIcon } from 'musetric/Resources/Icons/Frequency';
import { GithubIcon } from 'musetric/Resources/Icons/Github';
import { InfoIcon } from 'musetric/Resources/Icons/Info';
import { LightIcon } from 'musetric/Resources/Icons/Light';
import { LiveIcon } from 'musetric/Resources/Icons/Live';
import { MenuIcon } from 'musetric/Resources/Icons/Menu';
import { OpenFileIcon } from 'musetric/Resources/Icons/OpenFile';
import { ParametersIcon } from 'musetric/Resources/Icons/Parameters';
import { PerformanceIcon } from 'musetric/Resources/Icons/Performance';
import { PlayIcon } from 'musetric/Resources/Icons/Play';
import { RecordIcon } from 'musetric/Resources/Icons/Record';
import { SaveIcon } from 'musetric/Resources/Icons/Save';
import { SpectrogramIcon } from 'musetric/Resources/Icons/Spectrogram';
import { StopIcon } from 'musetric/Resources/Icons/Stop';
import { WaveformIcon } from 'musetric/Resources/Icons/Waveform';

export const getMusetricIcons = (): Icons => {
	return {
		AppIcon,
		CloseIcon,
		DarkIcon,
		FrequencyIcon,
		GithubIcon,
		InfoIcon,
		LightIcon,
		LiveIcon,
		MenuIcon,
		OpenFileIcon,
		ParametersIcon,
		PerformanceIcon,
		PlayIcon,
		RecordIcon,
		SaveIcon,
		SpectrogramIcon,
		StopIcon,
		WaveformIcon,
	};
};
