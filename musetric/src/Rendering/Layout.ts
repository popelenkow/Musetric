export type Rotation2D = 'none' | 'left' | 'right' | 'twice';

export type Direction2D = {
	rotation: Rotation2D;
	reflection: boolean;
};

export type Position2D = {
	x: number;
	y: number;
};

export type Size2D = {
	width: number;
	height: number;
};

export type Layout2D = {
	size: Size2D;
	position?: Position2D;
	direction?: Direction2D;
};

export const getCanvasCursorPosition2D = (
	canvas: HTMLCanvasElement,
	event: MouseEvent,
): Position2D => {
	const rect = canvas.getBoundingClientRect();
	const x = (event.clientX - rect.left) / (rect.width - 1);
	const y = (event.clientY - rect.top) / (rect.height - 1);
	return { x, y };
};

const rotate = (
	position: Position2D,
	rotation: Rotation2D,
) => {
	if (rotation === 'none') return position;
	if (rotation === 'left') return { x: 1 - position.y, y: position.x };
	if (rotation === 'right') return { x: position.y, y: 1 - position.x };
	if (rotation === 'twice') return { x: 1 - position.x, y: 1 - position.y };
	return position;
};

export const rotatePosition2D = (
	position: Position2D,
	direction?: Direction2D,
): Position2D => {
	if (!direction) return position;
	const { rotation, reflection } = direction;
	const p = rotate(position, rotation);
	return reflection ? { x: 1 - p.x, y: p.y } : p;
};

export const rotateSize2D = (
	size: Size2D,
	direction?: Direction2D,
): Size2D => {
	if (!direction) return size;
	const { rotation } = direction;
	if (rotation === 'none' || rotation === 'twice') return size;
	if (rotation === 'left' || rotation === 'right') return { width: size.height, height: size.width };
	return size;
};

export const drawImage = (
	context: CanvasRenderingContext2D,
	image: CanvasImageSource,
	layout: Layout2D,
) => {
	const { size, direction } = layout;
	const { rotation = 'none', reflection = false } = direction || {};
	context.save();
	if (rotation === 'twice') {
		if (reflection) {
			context.transform(1, 0, 0, -1, 0, size.height);
		} else {
			context.transform(-1, 0, 0, -1, size.width, size.height);
		}
	}
	if (rotation === 'right') {
		if (reflection) {
			context.transform(-1, 0, 0, 1, size.height, 0);
			context.translate(0, size.width);
			context.rotate(-Math.PI / 2);
		} else {
			context.translate(size.height, 0);
			context.rotate(Math.PI / 2);
		}
	}
	if (rotation === 'left') {
		if (reflection) {
			context.transform(-1, 0, 0, 1, size.width, 0);
			context.translate(size.width, 0);
			context.rotate(Math.PI / 2);
		} else {
			context.translate(0, size.width);
			context.rotate(-Math.PI / 2);
		}
	}
	if (rotation === 'none') {
		if (reflection) {
			context.transform(-1, 0, 0, 1, size.width, 0);
		}
	}
	context.drawImage(image, 0, 0);
	context.restore();
};
