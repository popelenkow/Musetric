import React from 'react';

export function createContext<T>(): React.Context<T> {
	return React.createContext<T>(undefined as unknown as T);
}
