import type { ReactElement, ReactNode } from 'react';

type ChildrenPropsMap = {
	required: { children: ReactNode },
	optional: { children?: ReactNode },
	// eslint-disable-next-line @typescript-eslint/ban-types
	none: {},
};
type ChildrenPropsType = keyof ChildrenPropsMap;
export type ChildrenProps<CType extends ChildrenPropsType = 'required'> = ChildrenPropsMap[CType];

type FCResultMap = {
	required: ReactElement,
	optional: ReactElement | null,
};
type FCResultType = keyof FCResultMap;
export type FCResult<Type extends FCResultType = 'required'> = FCResultMap[Type];

/** Strict FC */
export type SFC<
	// eslint-disable-next-line @typescript-eslint/ban-types
	Props = {},
	CType extends ChildrenPropsType = 'none',
	RType extends FCResultType = 'required',
> = (
	(props: Props & ChildrenProps<CType>) => FCResult<RType>
);
