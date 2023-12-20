/* eslint-disable @typescript-eslint/no-namespace */

import { SoundInfo, SoundStem } from './SoundInfo';

export namespace Api {
	export namespace Ping {
		export const route = '/api/ping';
	}
	export namespace GetSoundList {
		export const route = '/api/sound/list';
		export type Response = SoundInfo[];
	}
	export namespace AddSound {
		export const route = '/api/sound';
		export type Response = SoundInfo;
	}
	export namespace RemoveSound {
		export const route = (id: string): string => `/api/sound/${id}`;
	}
	export namespace GetSoundTrack {
		export const route = (id: string, stem: SoundStem, stemCount: number): string => `/api/sound/${id}/${stem}/${stemCount}`;
	}
}
