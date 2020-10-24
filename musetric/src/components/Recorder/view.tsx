import React, { useState } from 'react';
import { Model } from './model';
import { RecorderView } from './ModelView';
import { InitView } from './InitView';

export const View: React.FC<{}> = () => {
	const [model, setModel] = useState<Model>();

	return (
		<div className='RecorderView'>
			{ !model && <InitView setModel={setModel} /> }
			{ model && <RecorderView model={model} drop={() => setModel(undefined)} /> }
		</div>
	);
};
