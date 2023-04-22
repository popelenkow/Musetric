/* eslint-disable @typescript-eslint/no-namespace */

import { SeparationTaskInfo } from './SeparationTaskInfo';

export namespace Api {
	export namespace Ping {
		export const route = '/ping';
	}
	export namespace Separate {
		export const route = '/separate';
		export type Response = SeparationTaskInfo;
	}
	export namespace Remove {
		export const route = '/remove';
		export type Request = {
			id: string,
		};
	}
	export namespace SeparateList {
		export const route = '/separateList';
		export type Response = SeparationTaskInfo[];
	}
}
