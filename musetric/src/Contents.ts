/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type ContentId = 'recorder' | 'gameOfLife';
export const contentIdList: ContentId[] = ['recorder', 'gameOfLife'];
// eslint-disable-next-line max-len
export const isContentId = (value?: string | null): value is ContentId => contentIdList.findIndex(x => x === value) !== -1;
