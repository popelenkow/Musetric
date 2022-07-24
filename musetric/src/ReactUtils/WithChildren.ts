import type { ReactNode } from 'react';

export type WithChildren<Props = object> = Props & { children: ReactNode };
