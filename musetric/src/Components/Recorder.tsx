/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { saveAs } from 'file-saver';
import { AudioDevices, Controls } from '..';
import { Frequency, Sonogram } from '.';
import { theming, Theme } from '../Contexts/Theme';

export const getStyles = (theme: Theme) => ({
	root: {
		width: '100%',
		height: '100%',
		display: 'grid',
		gridTemplateRows: '28px 1fr',
		gridTemplateColumns: '1fr',
	},
	header: {
		width: '100%',
		height: '28px',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: theme.sidebarBg,
		borderBottom: `1px solid ${theme.splitter}`,
	},
	content: {
		display: 'grid',
		gridTemplateRows: '56px 1fr 1fr',
		gridTemplateColumns: '1fr',
		gap: '5px',
		padding: '5px',
		overflow: 'hidden',
	},
	contentView: {
		overflow: 'hidden',
		width: '100%',
		height: '100%',
		border: `1px solid ${theme.splitter}`,
	},
});

export const useStyles = createUseStyles(getStyles, { name: 'Recorder', theming });

const mergeBuffers = (recordBuffers: Float32Array[], recordLength: number) => {
	const result = new Float32Array(recordLength);
	let offset = 0;
	for (let i = 0; i < recordBuffers.length; i++) {
		result.set(recordBuffers[i], offset);
		offset += recordBuffers[i].length;
	}
	return result;
};

export type RecorderProps = {
	recorderDevice: AudioDevices.RecorderDevice;
	drop: () => void;
};

export const RecorderView: React.FC<RecorderProps> = (props) => {
	const { recorderDevice, drop } = props;
	const classes = useStyles();
	const buttonClasses = Controls.Button.useStyles();

	const { audioContext, recorder, wavCoder } = recorderDevice;

	const [isRecording, setIsRecording] = useState<boolean>(false);

	const [audioData, setAudioData] = useState<Float32Array>();
	const [blob, setBlob] = useState<Blob>();
	const url = useMemo(() => (blob ? URL.createObjectURL(blob) : undefined), [blob]);
	const audioState = useMemo<{ audioData?: Float32Array }>(() => ({}), []);

	useEffect(() => {
		const arr: Float32Array[] = [];
		let len = 0;
		recorder.subscribe(buffers => {
			arr.push(buffers[0]);
			len += buffers[0].length;
			if (arr.length % 33 === 0) {
				const result = mergeBuffers(arr, len);
				setAudioData(result);
				audioState.audioData = result;
			}
		});
	}, [recorder, audioState]);

	const saveAudio = () => {
		if (!blob) return;
		saveAs(blob, 'myRecording.wav');
	};

	const start = () => {
		setBlob(undefined);
		recorder.start();

		setIsRecording(true);
	};

	const stop = async () => {
		recorder.stop();
		const buffers = await recorder.getBuffer();
		setAudioData(buffers[0]);
		const { sampleRate } = audioContext;
		const b = await wavCoder.encode({ buffers, sampleRate });
		setBlob(b);

		// recorder.clear();
		setIsRecording(false);
	};

	return (
		<div className={classes.root}>
			<div id='controls' className={classes.header}>
				{isRecording
					? <button type='button' className={buttonClasses.root} onClick={stop}>stop</button>
					: <button type='button' className={buttonClasses.root} onClick={start}>start</button>}
				<button type='button' className={buttonClasses.root} onClick={saveAudio}>save</button>
				<button type='button' className={buttonClasses.root} onClick={drop}>drop</button>
			</div>
			<div className={classes.content}>
				<div className={classes.contentView}>
					{url && <audio className='recorder-item' key={url} controls src={url} />}
				</div>
				<div className={classes.contentView}>
					{audioData && <Sonogram.View state={audioState} />}
				</div>
				<div className={classes.contentView}>
					<Frequency.View recorderDevice={recorderDevice} />
				</div>
			</div>
		</div>
	);
};

export type Props = {
};

export const View: React.FC<Props> = () => {
	const buttonClasses = Controls.Button.useStyles();

	const [recorderDevice, setRecorderDevice] = useState<AudioDevices.RecorderDevice>();

	const init = async () => {
		const value = await AudioDevices.createRecorderDevice();
		setRecorderDevice(value);
	};

	return (recorderDevice
		? <RecorderView recorderDevice={recorderDevice} drop={() => setRecorderDevice(undefined)} />
		: <button type='button' className={buttonClasses.root} style={{ width: '100%', height: '100%' }} onClick={init}>init</button>
	);
};
