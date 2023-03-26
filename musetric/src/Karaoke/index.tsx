import React from 'react';
import { createClasses, createUseClasses } from '../App/AppCss';
import { SFC } from '../UtilityTypes/React';
import { KaraokePanel } from './Components/KaraokePanel';
import { MusicListPanel } from './Components/MusicListPanel';
import { StorageButton } from './Controls/StorageButton';
import { UploadButton } from './Controls/UploadButton';
import { KaraokeProvider } from './KaraokeContext';

export const getKaraokeClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			'background-color': theme.background,
			display: 'grid',
			overflow: 'hidden',
			'grid-template-rows': '1fr 50px',
			'grid-template-columns': '1fr 50px',
			'grid-template-areas': `
				"main sidebar"
				"toolbar sidebar"
			`,
		},
		main: {
			'grid-area': 'main',
			overflow: 'hidden',
			display: 'flex',
			'flex-direction': 'column',
		},
		sidebar: {
			'grid-area': 'sidebar',
			'box-sizing': 'border-box',
			padding: '4px 0px',
			display: 'flex',
			'flex-direction': 'column',
			'justify-content': 'center',
			'align-items': 'center',
			'row-gap': '4px',
			'background-color': theme.backgroundPanel,
			'border-left': `1px solid ${theme.divider}`,
		},
		sidebarTop: {
			display: 'flex',
			'flex-direction': 'column',
		},
		sidebarMiddle: {
			height: '100%',
			display: 'flex',
			'flex-direction': 'column',
			'justify-content': 'center',
		},
		sidebarBottom: {
			display: 'flex',
			'flex-direction': 'column',
		},
		toolbar: {
			'grid-area': 'toolbar',
			'box-sizing': 'border-box',
			padding: '0px 4px',
			display: 'flex',
			'flex-direction': 'row',
			'justify-content': 'center',
			'align-items': 'center',
			'column-gap': '4px',
			'background-color': theme.backgroundPanel,
			'border-top': `1px solid ${theme.divider}`,
		},
	};
});
const useClasses = createUseClasses('Karaoke', getKaraokeClasses);

const Karaoke: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<div className={classes.main}>
				<MusicListPanel />
				<KaraokePanel />
			</div>
			<div className={classes.sidebar}>
				<div className={classes.sidebarTop}>
					<UploadButton />
				</div>
				<div className={classes.sidebarMiddle} />
				<div className={classes.sidebarBottom}>
					<StorageButton />
				</div>
			</div>
			<div className={classes.toolbar} />
		</div>
	);
};

const WithStore: SFC = () => (
	<KaraokeProvider>
		<Karaoke />
	</KaraokeProvider>
);
export {
	WithStore as Karaoke,
};
