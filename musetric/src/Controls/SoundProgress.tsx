import React, { useState } from 'react';
import classNames from 'classnames';
import { Theme, createUseClasses, SoundBuffer, useAnimation, getFieldClasses } from '..';

export const getSoundProgressClasses = (theme: Theme) => ({
	root: {
		...getFieldClasses(theme).root,
		width: '118px',
		height: '42px',
		position: 'relative',
		'border-radius': '21px',
		'user-select': 'none',
	},
});

export const useSoundProgressClasses = createUseClasses('SoundProgress', getSoundProgressClasses);

export type SoundProgressProps = {
	soundBuffer: SoundBuffer;
	className?: string;
};

export const SoundProgress: React.FC<SoundProgressProps> = (props) => {
	const { soundBuffer, className } = props;
	const classes = useSoundProgressClasses();

	const rootName = classNames(className || classes.root);

	const [cursor, setCursor] = useState<string>('');
	const [memory, setMemory] = useState<string>('');

	useAnimation(() => {
		const cursorValue = new Date((soundBuffer.cursor / soundBuffer.sampleRate) * 1000);
		setCursor(cursorValue.toISOString().substr(14, 5));

		const memoryValue = new Date((soundBuffer.memorySize / soundBuffer.sampleRate) * 1000);
		setMemory(memoryValue.toISOString().substr(14, 5));
	}, [soundBuffer]);

	return (
		<div className={rootName}>
			{`${cursor} / ${memory}`}
		</div>
	);
};
