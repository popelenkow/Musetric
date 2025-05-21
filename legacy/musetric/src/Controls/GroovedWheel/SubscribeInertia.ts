import { startAnimation } from '../../Rendering/Animation';
import { Position2D } from '../../Rendering/Layout';
import { Inertia } from './Inertia';

const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
    return event instanceof TouchEvent;
};

type ClientPosition = {
    clientX: number,
    clientY: number,
};
const getClientPosition = (event: MouseEvent | TouchEvent): ClientPosition => {
    const { clientX, clientY } = isTouchEvent(event) ? event.touches[0] : event;
    return { clientX, clientY };
};

export type InertialDragOptions = {
    inertia: Inertia,
    element: HTMLElement,
    onMove: (delta: Position2D) => void,
    onActive: (value: boolean) => void,
};
export type UnsubscribeInertia = () => void;
export const subscribeInertia = (options: InertialDragOptions): UnsubscribeInertia => {
    const { inertia, element, onMove, onActive } = options;
    let isDragging = false;

    const currentPosition: Position2D = { x: 0, y: 0 };
    const commitPosition: Position2D = { x: 0, y: 0 };
    const commit = (): void => {
        commitPosition.x = currentPosition.x;
        commitPosition.y = currentPosition.y;
    };
    const getDelta = (): Position2D => {
        return {
            x: currentPosition.x - commitPosition.x,
            y: currentPosition.y - commitPosition.y,
        };
    };
    const onDragMove = (event: MouseEvent | TouchEvent): void => {
        if (!isDragging) return;
        event.preventDefault();
        const { clientX, clientY } = getClientPosition(event);
        const delta: Position2D = {
            x: clientX - currentPosition.x,
            y: clientY - currentPosition.y,
        };
        currentPosition.x = clientX;
        currentPosition.y = clientY;
        onMove(delta);
    };

    const onDragStart = (event: MouseEvent | TouchEvent): void => {
        isDragging = true;
        inertia.stop();
        const { clientX, clientY } = getClientPosition(event);
        currentPosition.x = clientX;
        currentPosition.y = clientY;
        commit();
    };

    const onDragEnd = (): void => {
        isDragging = false;
    };

    const stopAnimation = startAnimation((msTime: number) => {
        const time = msTime / 1000;
        if (isDragging) {
            const delta = getDelta();
            inertia.setDelta(delta, time);
            commit();
            onActive(true);
        }
        else {
            const delta: Position2D = inertia.getDelta(time);
            if (delta.x === 0 && delta.y === 0) {
                onActive(false);
                return;
            }
            onMove(delta);
            onActive(true);
        }
    });
    element.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    element.addEventListener('touchstart', onDragStart);
    document.addEventListener('touchmove', onDragMove);
    document.addEventListener('touchend', onDragEnd);

    return () => {
        stopAnimation();
        element.removeEventListener('mousedown', onDragStart);
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);

        element.removeEventListener('touchstart', onDragStart);
        document.removeEventListener('touchmove', onDragMove);
    };
};
