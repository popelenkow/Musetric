import { useRef, useEffect } from 'react';
import { LoopCallback, startLoop, StopLoop } from '../Rendering/Loop';

export const useLoopCallback = (
    callback?: LoopCallback,
    timeout?: number,
): void => {
    type Ref = {
        callback?: LoopCallback,
        stopLoop?: StopLoop,
    };
    const ref = useRef<Ref>({});

    if (callback && !ref.current.stopLoop) {
        ref.current.callback = callback;
        ref.current.stopLoop = startLoop((...args) => {
            ref.current.callback?.(...args);
        }, timeout);
    }
    else if (!callback && ref.current.stopLoop) {
        ref.current.stopLoop();
        ref.current.stopLoop = undefined;
    }
    else {
        ref.current.callback = callback;
    }

    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            ref.current.stopLoop?.();
        };
    }, []);
};

export const useLoop = (
    createCallback: () => LoopCallback | undefined,
    timeout?: number,
): void => {
    useLoopCallback(createCallback(), timeout);
};
