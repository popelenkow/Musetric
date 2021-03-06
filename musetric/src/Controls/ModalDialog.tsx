import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, theming, Button, CloseIcon, AppElementContext } from '..';

export const getModalDialogStyles = (theme: Theme) => ({
	root: {
		position: 'absolute',
		top: '0',
		left: '0',
		display: 'grid',
		gridTemplateRows: '32px 1fr',
		gridTemplateColumns: '1fr',
		width: 'calc(100vw - 2px)',
		height: 'calc(100vh - 2px)',
		overflow: 'hidden',
		color: theme.content,
		border: `1px solid ${theme.splitter}`,
		backgroundColor: theme.contentBg,
	},
	toolbar: {
		width: '100%',
		height: '32px',
		display: 'flex',
		flexDirection: 'row',
		'justify-content': 'right',
		backgroundColor: theme.sidebarBg,
		borderBottom: `1px solid ${theme.splitter}`,
	},
});

export const useModalDialogStyles = createUseStyles(getModalDialogStyles, { name: 'ModalDialog', theming });

export type ModalDialogProps = {
};

export const ModalDialog: React.FC<ModalDialogProps> = (props) => {
	const { children } = props;
	const classes = useModalDialogStyles();

	const { setModalDialog } = useContext(AppElementContext);
	return (
		<div className={classes.root}>
			<div className={classes.toolbar}>
				<Button onClick={() => setModalDialog()}><CloseIcon /></Button>
			</div>
			{children}
		</div>
	);
};
