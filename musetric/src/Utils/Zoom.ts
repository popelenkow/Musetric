export const disableZoom = (element: HTMLElement | undefined) => {
	const keydownListener = (event: KeyboardEvent) => {
		const keys = ['-', '+', '=', '_'];
		if (event.ctrlKey === true && keys.some((x) => event.key === x)) {
			event.preventDefault();
		}
	};
	const wheelListener = (event: WheelEvent) => {
		if (event.ctrlKey === true) {
			event.preventDefault();
		}
	};
	document.body.addEventListener('keydown', keydownListener);
	element?.addEventListener('wheel', wheelListener);
	return () => {
		document.body.removeEventListener('keydown', keydownListener);
		element?.removeEventListener('wheel', wheelListener);
	};
};
