import { Context, useContext } from 'react';

export const useInitializedContext = <T>(
	context: Context<T | undefined>,
	hookName: string,
): T => {
	const store = useContext(context);
	if (store === undefined) {
		throw new Error(`Use the React Provider for ${hookName} hook`);
	}
	return store;
};
