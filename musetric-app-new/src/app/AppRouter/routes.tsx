export const routePatterns = {
    home: '/',
    login: '/login',
    projects: '/projects',
    workshop: '/workshop',
} as const;

export const routeLinks = {
    ...routePatterns,
};

export const matchPathPatterns = (pathName: string, patterns: string[]) => {
    const toRegex = (pattern: string) => {
        const regex = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
        return new RegExp(`^${regex}$`);
    };

    const isMatch = patterns.some((pattern) => {
        const regex = toRegex(pattern);
        return regex.test(pathName);
    });

    return isMatch;
};
