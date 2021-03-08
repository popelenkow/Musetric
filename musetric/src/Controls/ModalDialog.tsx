import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, theming, Button, CloseIcon, AppElementContext, AppIcon } from '..';

export const getModalDialogStyles = (theme: Theme) => ({
	root: {
		position: 'absolute',
		top: '0',
		left: '0',
		display: 'grid',
		gridTemplateRows: '33px 1fr',
		gridTemplateColumns: '1fr',
		width: 'calc(100vw - 2px)',
		height: 'calc(100vh - 2px)',
		overflow: 'hidden',
		color: theme.color.content,
		border: `1px solid ${theme.color.splitter}`,
		backgroundColor: theme.color.contentBg,
	},
	toolbar: {
		width: '100%',
		height: '32px',
		display: 'flex',
		backgroundColor: theme.color.sidebarBg,
		borderBottom: `1px solid ${theme.color.splitter}`,
	},
	icon: {
		flexGrow: '1',
		maxWidth: '32px',
		maxHeight: '32px',
		'& path': {
			fill: theme.color.icon,
		},
	},
	text: {
		flexGrow: '2',
		maxHeight: '32px',
		width: 'auto',
		font: '12px/32px "Segoe UI", Arial, sans-serif',
		color: theme.color.content,
		textIndent: '10px',
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
				<div className={classes.icon}><AppIcon /></div>
				<div className={classes.text}>Musetric</div>
				<Button onClick={() => setModalDialog()}><CloseIcon /></Button>
			</div>
			{children}
		</div>
	);
};
