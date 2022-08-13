export type UnsubscribeDisableZoom = () => void;
export const subscribeDisableZoom = (element: HTMLElement | undefined): UnsubscribeDisableZoom => {
	const keydownListener = (event: KeyboardEvent): void => {
		const keys = ['-', '+', '=', '_'];
		if (event.ctrlKey === true && keys.some((x) => event.key === x)) {
			event.preventDefault();
		}
	};
	const wheelListener = (event: WheelEvent): void => {
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
