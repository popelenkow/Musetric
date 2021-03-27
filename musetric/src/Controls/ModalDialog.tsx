import React from 'react';
import { Theme, createUseClasses, Button, CloseIcon, AppTitlebar } from '..';

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
});

export const useModalDialogClasses = createUseClasses('ModalDialog', getModalDialogClasses);

export type ModalDialogProps = {
	closeModal: (modal?: React.ReactNode) => void
};

export const ModalDialog: React.FC<ModalDialogProps> = (props) => {
	const { closeModal, children } = props;
	const classes = useModalDialogClasses();

	return (
		<div className={classes.root}>
			<AppTitlebar>
				<Button onClick={() => closeModal()}><CloseIcon /></Button>
			</AppTitlebar>
			{children}
		</div>
	);
};
