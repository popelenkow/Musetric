import React from 'react';
import { AppElement, Content, Locale, Theme } from '.';

export type Props =
	& AppElement.Props
	& Content.Props
	& Locale.Props
	& Theme.Props;

export const Provider: React.FC<Props> = (props) => {
	const { children } = props;

	return (
		<Locale.Provider {...props}>
			<Theme.Provider {...props}>
				<Content.Provider {...props}>
					<AppElement.Provider {...props}>
						{children}
					</AppElement.Provider>
				</Content.Provider>
			</Theme.Provider>
		</Locale.Provider>
	);
};
