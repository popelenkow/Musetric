export type ClassNameModifiers = Record<string, boolean | undefined>;
export const getClassNames = (
    className: string,
    objModifiers: ClassNameModifiers,
): string => {
    const modifiers = Object.entries(objModifiers).map(([modifier, enable]) => (
        enable ? modifier : ''
    )).filter((x) => x);
    const result = [
        className,
        ...modifiers.map((modifier) => `${className}--${modifier}`),
    ];
    return result.join(' ');
};
