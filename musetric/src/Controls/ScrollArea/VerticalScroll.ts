type ElementType = 'content' | 'verticalTrack' | 'verticalThumb';
type Elements = Record<ElementType, HTMLDivElement>;

export const getVerticalScrollPosition = (content: HTMLDivElement): number | undefined => {
	const { scrollHeight, scrollTop, clientHeight } = content;
	if (scrollHeight <= clientHeight) return undefined;
	return Math.floor(scrollTop) / (scrollHeight - clientHeight);
};

const getVerticalScrollHeights = (elements: Elements) => {
	const { content, verticalTrack } = elements;
	const { scrollHeight, clientHeight } = content;
	const { paddingTop, paddingBottom } = getComputedStyle(verticalTrack);
	const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
	const trackHeight = verticalTrack.clientHeight - padding;
	const thumbHeight = Math.ceil(trackHeight * (clientHeight / scrollHeight));
	return { trackHeight, thumbHeight };
};

const getVerticalOriginalScrollPosition = (offset: number, elements: Elements) => {
	const { content } = elements;
	const { scrollHeight, clientHeight } = content;
	const { trackHeight, thumbHeight } = getVerticalScrollHeights(elements);
	const scrollableContentHeight = scrollHeight - clientHeight;
	const scrollableHeight = trackHeight - thumbHeight;
	return offset * (scrollableContentHeight / scrollableHeight);
};

export const updateVerticalScrollPosition = (
	elements: Elements,
	position: number,
) => {
	const { verticalThumb } = elements;
	const { trackHeight, thumbHeight } = getVerticalScrollHeights(elements);
	const y = position * (trackHeight - thumbHeight);
	verticalThumb.style.height = `${thumbHeight}px`;
	verticalThumb.style.transform = `translateY(${y}px)`;
};

const getClientY = (event: MouseEvent | TouchEvent) => {
	if (event instanceof TouchEvent) return event.targetTouches[0].clientY;
	return event.clientY;
};

export const subscribeVerticalEvents = (elements: Elements) => {
	const { content, verticalTrack, verticalThumb } = elements;
	let dragging = false;
	let prevPosition = 0;
	const drag = (event: MouseEvent | TouchEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const clientY = getClientY(event);
		const { top } = verticalTrack.getBoundingClientRect();
		const { thumbHeight } = getVerticalScrollHeights(elements);
		const position = clientY - top - thumbHeight / 2;
		content.scrollTop = getVerticalOriginalScrollPosition(position, elements);
	};
	const startDrag = (event: MouseEvent | TouchEvent) => {
		event.preventDefault();
		event.stopPropagation();
		dragging = true;
		const clientY = getClientY(event);
		const { top } = verticalThumb.getBoundingClientRect();
		prevPosition = clientY - top;
	};
	const onDrag = (event: MouseEvent | TouchEvent) => {
		if (!dragging) return;
		const clientY = getClientY(event);
		const { top } = verticalTrack.getBoundingClientRect();
		const position = clientY - top - prevPosition;
		content.scrollTop = getVerticalOriginalScrollPosition(position, elements);
	};
	const stopDrag = () => {
		dragging = false;
	};
	verticalTrack.addEventListener('touchstart', drag);
	verticalThumb.addEventListener('touchstart', startDrag);
	document.addEventListener('touchmove', onDrag);
	document.addEventListener('touchend', stopDrag);

	verticalTrack.addEventListener('mousedown', drag);
	verticalThumb.addEventListener('mousedown', startDrag);
	document.addEventListener('mousemove', onDrag);
	document.addEventListener('mouseup', stopDrag);
	return () => {
		verticalTrack.removeEventListener('touchstart', drag);
		verticalThumb.removeEventListener('touchstart', startDrag);
		document.removeEventListener('touchmove', onDrag);
		document.removeEventListener('touchend', stopDrag);

		verticalTrack.removeEventListener('mousedown', drag);
		verticalThumb.removeEventListener('mousedown', startDrag);
		document.removeEventListener('mousemove', onDrag);
		document.removeEventListener('mouseup', stopDrag);
	};
};
