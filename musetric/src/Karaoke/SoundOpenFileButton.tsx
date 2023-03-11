import React from 'react';
import { useAppApi, useAppLocale } from '../App/AppContext';
import { Icon } from '../Controls/Icon';
import { SelectFile, SelectFileProps } from '../Controls/SelectFile';
import { SFC } from '../UtilityTypes/React';
import { skipPromise } from '../Utils/SkipPromise';

export const SoundOpenFileButton: SFC = () => {
	const { i18n } = useAppLocale();
	const api = useAppApi();

	const upload = async (file: File): Promise<void> => {
		const res = await api.postFile('upload', file).request();
		console.log(res);
	};
	const openFileProps: SelectFileProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:open'),
		changeFile: (file) => skipPromise(upload(file)),
	};
	return (
		<SelectFile {...openFileProps}>
			<Icon name='openFile' />
		</SelectFile>
	);
};
