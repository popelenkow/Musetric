import { AppAbout, AppAboutProps } from 'musetric/App/AppAbout';
import { useAppApi, useAppLocale } from 'musetric/App/AppContext';
import { AppViewEntry } from 'musetric/App/AppDropdown';
import { Button, ButtonProps } from 'musetric/Controls/Button';
import { Icon } from 'musetric/Controls/Icon';
import { Karaoke } from 'musetric/Karaoke';
import { SoundWorkshop } from 'musetric/SoundWorkshop';
import { skipPromise } from 'musetric/Utils/SkipPromise';
import { Api } from 'musetric-api/Api';
import React, { useEffect, useState } from 'react';

export type ViewId = 'soundWorkshop' | 'karaoke' | 'about';
export const useViewEntries = (): AppViewEntry<ViewId>[] => {
	const { i18n } = useAppLocale();

	const api = useAppApi();

	const [withServer, setWithServer] = useState(false);

	useEffect(() => {
		const ping = async (): Promise<void> => {
			const response = await api.getJson(Api.Ping.route).request();
			if (response.type !== 'ok') return;
			setWithServer(true);
		};
		skipPromise(ping());
	}, [api]);

	const githubProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		primary: true,
		onClick: () => {
			window.location.href = 'https://github.com/popelenkow/Musetric';
		},
	};
	const performanceProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		primary: true,
		onClick: () => {
			window.location.href = `${window.location.origin}/perf.html`;
		},
	};
	const aboutInfoProps: AppAboutProps = {
		appVersion: process.env.APP_VERSION || '???',
		links: [
			<Button {...githubProps}><Icon name='github' /></Button>,
			<Button {...performanceProps}><Icon name='performance' /></Button>,
		],
	};

	const result: AppViewEntry<ViewId>[] = [
		{ type: 'view', id: 'soundWorkshop', name: i18n.t('App:soundWorkshop'), element: <SoundWorkshop /> },
		{ type: 'view', id: 'karaoke', name: i18n.t('App:karaoke'), element: <Karaoke /> },
		{ type: 'divider' },
		{ type: 'view', id: 'about', name: i18n.t('App:about'), element: <AppAbout {...aboutInfoProps} /> },
	];
	return result.filter((x) => {
		if (x.type !== 'view') return true;
		if (x.id === 'karaoke') return withServer;
		return true;
	});
};
