/* eslint-disable @typescript-eslint/no-namespace */

import { SeparationTrackType } from './Music';
import { SeparationTaskInfo } from './SeparationTaskInfo';

export namespace Api {
	export namespace Ping {
		export const route = '/ping';
	}
	export namespace Separate {
		export const route = '/separate';
		export type Response = SeparationTaskInfo;
	}
	export namespace RemoveTrack {
		export const route = '/RemoveTrack';
		export type Request = {
			id: string,
		};
	}
	export namespace SeparatedChunk {
		export const route = '/SeparatedChunk';
		export type Request = {
			id: string,
			chunkIndex: number,
			trackType: SeparationTrackType,
		};
	}
	export namespace SeparatedList {
		export const route = '/SeparatedList';
		export type Response = SeparationTaskInfo[];
	}
}
