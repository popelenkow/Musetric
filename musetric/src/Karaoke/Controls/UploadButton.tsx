import React from 'react';
import { Api } from '../../Api/Api';
import { useAppApi, useAppLocale } from '../../App/AppContext';
import { Icon } from '../../Controls/Icon';
import { SelectFile, SelectFileProps } from '../../Controls/SelectFile';
import { SFC } from '../../UtilityTypes/React';
import { skipPromise } from '../../Utils/SkipPromise';

export const UploadButton: SFC = () => {
	const { i18n } = useAppLocale();
	const api = useAppApi();

	const separate = async (file: File): Promise<void> => {
		await api.postFile(Api.AddSound.route, file).request();
	};
	const openFileProps: SelectFileProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:open'),
		changeFile: (file) => skipPromise(separate(file)),
	};
	return (
		<SelectFile {...openFileProps}>
			<Icon name='openFile' />
		</SelectFile>
	);
};
