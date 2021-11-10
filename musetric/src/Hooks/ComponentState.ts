import { useState, useCallback } from 'react';
import { useLogContext } from '../AppContexts/Log';

export type ComponentStateProps<State> = {
	onState: (state: State) => void;
	onError: (message: string) => void;
};
export type ComponentState<State> = {
	state: State | undefined;
	props: ComponentStateProps<State>;
};
export function useComponentState<State>(): ComponentState<State> {
	const [state, onState] = useState<State>();
	const { log } = useLogContext();

	const onError = useCallback((message: string) => {
		log.error(message);
	}, [log]);

	return {
		state,
		props: { onState, onError },
	};
}
