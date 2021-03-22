import React from 'react';
import { Theme, createUseClasses, Button, CloseIcon, useAppElement, AppTitlebar } from '..';

export const getModalDialogClasses = (theme: Theme) => ({
	root: {
		position: 'absolute',
		'z-index': '200',
		top: '0',
		left: '0',
		display: 'grid',
		gridTemplateRows: '49px 1fr',
		gridTemplateColumns: '1fr',
		width: 'calc(100vw - 2px)',
		height: 'calc(100vh - 2px)',
		overflow: 'hidden',
		color: theme.color.content,
		border: `1px solid ${theme.color.splitter}`,
		backgroundColor: theme.color.app,
	},
	text: {
		flexGrow: '2',
		maxHeight: '42px',
		width: 'auto',
		font: '18px/42px "Segoe UI", Arial, sans-serif',
		color: theme.color.content,
		textIndent: '10px',
	},
});

export const useModalDialogClasses = createUseClasses('ModalDialog', getModalDialogClasses);

export type ModalDialogProps = {
};

export const ModalDialog: React.FC<ModalDialogProps> = (props) => {
	const { children } = props;
	const classes = useModalDialogClasses();

	const { setModalDialog } = useAppElement();

	return (
		<div className={classes.root}>
			<AppTitlebar>
				<Button onClick={() => setModalDialog()}><CloseIcon /></Button>
			</AppTitlebar>
			{children}
		</div>
	);
};
