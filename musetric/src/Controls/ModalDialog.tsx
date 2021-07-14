import React from 'react';
import { AppCss, createUseClasses, Button, CloseIcon, AppTitlebar } from '..';

export const getModalDialogClasses = (css: AppCss) => ({
	root: {
		position: 'absolute',
		'z-index': '200',
		top: '0',
		left: '0',
		display: 'grid',
		'grid-template-rows': '48px 1fr',
		'grid-template-columns': '1fr',
		'box-sizing': 'border-box',
		width: '100vw',
		height: '100vh',
		overflow: 'hidden',
		color: css.theme.content,
		border: `1px solid ${css.theme.splitter}`,
		'background-color': css.theme.app,
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
