type ElementType = 'content' | 'horizontalTrack' | 'horizontalThumb';
type Elements = Record<ElementType, HTMLDivElement>;

export const getHorizontalScrollPosition = (content: HTMLDivElement): number | undefined => {
	const { scrollWidth, scrollLeft, clientWidth } = content;
	if (scrollWidth <= clientWidth) return undefined;
	return Math.floor(scrollLeft) / (scrollWidth - clientWidth);
};

type HorizontalScrollWidth = {
	trackWidth: number,
	thumbWidth: number,
};
const getHorizontalScrollWidth = (elements: Elements): HorizontalScrollWidth => {
	const { content, horizontalTrack } = elements;
	const { clientWidth, scrollWidth } = content;
	const { paddingLeft, paddingRight } = getComputedStyle(horizontalTrack);
	const padding = parseFloat(paddingLeft) + parseFloat(paddingRight);
	const trackWidth = horizontalTrack.clientWidth - padding;
	const thumbWidth = Math.ceil(trackWidth * (clientWidth / scrollWidth));
	return { trackWidth, thumbWidth };
};

const getHorizontalOriginalScrollPosition = (position: number, elements: Elements): number => {
	const { content } = elements;
	const { scrollWidth, clientWidth } = content;
	const { trackWidth, thumbWidth } = getHorizontalScrollWidth(elements);
	const scrollableContentWidth = scrollWidth - clientWidth;
	const scrollableWidth = trackWidth - thumbWidth;
	return position * (scrollableContentWidth / scrollableWidth);
};

export const updateHorizontalScrollPosition = (
	elements: Elements,
	position: number,
): void => {
	const { horizontalThumb } = elements;
	const { trackWidth, thumbWidth } = getHorizontalScrollWidth(elements);
	const x = position * (trackWidth - thumbWidth);
	horizontalThumb.style.width = `${thumbWidth}px`;
	horizontalThumb.style.transform = `translateX(${x}px)`;
};

const getClientX = (event: MouseEvent | TouchEvent): number => {
	if (event instanceof TouchEvent) return event.targetTouches[0].clientX;
	return event.clientX;
};

export type UnsubscribeHorizontalEvents = () => void;
export const subscribeHorizontalEvents = (elements: Elements): UnsubscribeHorizontalEvents => {
	const { content, horizontalTrack, horizontalThumb } = elements;
	let dragging = false;
	let prevPosition = 0;
	const drag = (event: MouseEvent | TouchEvent): void => {
		event.preventDefault();
		event.stopPropagation();
		const clientX = getClientX(event);
		const { left } = horizontalTrack.getBoundingClientRect();
		const { thumbWidth } = getHorizontalScrollWidth(elements);
		const position = clientX - left - thumbWidth / 2;
		content.scrollLeft = getHorizontalOriginalScrollPosition(position, elements);
	};
	const startDrag = (event: MouseEvent | TouchEvent): void => {
		event.preventDefault();
		event.stopPropagation();
		dragging = true;
		const clientX = getClientX(event);
		const { left } = horizontalThumb.getBoundingClientRect();
		prevPosition = clientX - left;
	};
	const onDrag = (event: MouseEvent | TouchEvent): void => {
		if (!dragging) return;
		const clientX = getClientX(event);
		const { left } = horizontalTrack.getBoundingClientRect();
		const position = clientX - left - prevPosition;
		content.scrollLeft = getHorizontalOriginalScrollPosition(position, elements);
	};
	const stopDrag = (): void => {
		dragging = false;
	};
	horizontalTrack.addEventListener('touchstart', drag);
	horizontalThumb.addEventListener('touchstart', startDrag);
	document.addEventListener('touchmove', onDrag);
	document.addEventListener('touchend', stopDrag);

	horizontalTrack.addEventListener('mousedown', drag);
	horizontalThumb.addEventListener('mousedown', startDrag);
	document.addEventListener('mousemove', onDrag);
	document.addEventListener('mouseup', stopDrag);
	return () => {
		horizontalTrack.removeEventListener('touchstart', drag);
		horizontalThumb.removeEventListener('touchstart', startDrag);
		document.removeEventListener('touchmove', onDrag);
		document.removeEventListener('touchend', stopDrag);

		horizontalTrack.removeEventListener('mousedown', drag);
		horizontalThumb.removeEventListener('mousedown', startDrag);
		document.removeEventListener('mousemove', onDrag);
		document.removeEventListener('mouseup', stopDrag);
	};
};
