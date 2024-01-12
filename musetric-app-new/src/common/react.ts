import type { ReactElement, ReactNode } from 'react';

type ChildrenPropsMap = {
    required: { children: ReactNode },
    optional: { children?: ReactNode },
    none: object,
};
type ChildrenPropsType = keyof ChildrenPropsMap;
export type ChildrenProps<CType extends ChildrenPropsType = 'required'> = ChildrenPropsMap[CType];

type FCResultMap = {
    required: ReactElement,
    optional: ReactElement | null,
    none: null,
};
type FCResultType = keyof FCResultMap;
export type FCResult<Type extends FCResultType = 'required'> = FCResultMap[Type];

type FCOptions = {
    children?: ChildrenPropsType,
    result?: FCResultType,
};
type StopChildrenProps = {
    children?: undefined,
};
/** Strict React.FC */
export type SFC<
    Props extends object & StopChildrenProps = object,
    Options extends FCOptions = { children: 'none', result: 'required' },
> = (
    props: (
        & Props
        & ChildrenProps<Options['children'] extends ChildrenPropsType ? Options['children'] : 'none'>
    ),
) => (
    FCResult<Options['result'] extends FCResultType ? Options['result'] : 'required'>
);
