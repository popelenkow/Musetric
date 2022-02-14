import React, { FC, RefObject, useRef, useMemo, useEffect, useState } from 'react';
import className from 'classnames';
import { mapObject, someObject } from '../../Utils/Object';
import { createUseClasses, createClasses } from '../../AppContexts/Css';
import { useAnimation } from '../../Hooks/Animation';
import {
	getHorizontalScrollPosition,
	updateHorizontalScrollPosition,
	subscribeHorizontalEvents,
} from './HorizontalScroll';
import {
	getVerticalScrollPosition,
	updateVerticalScrollPosition,
	subscribeVerticalEvents,
} from './VerticalScroll';

export const getScrollAreaClasses = createClasses(() => {
	return {
		root: {
			position: 'relative',
			width: '100%',
			height: '100%',
			'box-sizing': 'border-box',
		},
		content: {
			position: 'absolute',
			'box-sizing': 'border-box',
			overflow: 'auto',
			inset: '0px',
			'&::-webkit-scrollbar, &::-webkit-scrollbar-corner': {
				display: 'none !important',
				width: '0px !important',
				height: '0px !important',
				visibility: 'hidden !important',
				background: 'transparent !important',
			},
			// Firefox
			'scrollbar-width': 'none !important',
		},
		horizontalTrack: {
			position: 'absolute',
			height: '10px',
			left: '0',
			right: '0',
			bottom: '0',
			background: 'rgba(100,100,100,0.3)',
			'&.hidden': {
				display: 'none',
			},
		},
		horizontalThumb: {
			position: 'absolute',
			'z-index': '1',
			height: '10px',
			background: 'rgba(100,100,100,0.6)',
		},
		verticalTrack: {
			position: 'absolute',
			width: '10px',
			top: '0',
			bottom: '0',
			right: '0',
			background: 'rgba(100,100,100,0.3)',
			'&.hidden': {
				display: 'none',
			},
		},
		verticalThumb: {
			position: 'absolute',
			'z-index': '1',
			width: '10px',
			background: 'rgba(100,100,100,0.6)',
			'pointer-events': 'all',
		},
	};
});
const useClasses = createUseClasses('ScrollArea', getScrollAreaClasses);

type ElementType = 'content' | 'horizontalTrack' | 'horizontalThumb' | 'verticalTrack' | 'verticalThumb';
type Elements = Record<ElementType, HTMLDivElement>;
const useRefs = () => {
	const content = useRef<HTMLDivElement>(null);
	const horizontalTrack = useRef<HTMLDivElement>(null);
	const horizontalThumb = useRef<HTMLDivElement>(null);
	const verticalTrack = useRef<HTMLDivElement>(null);
	const verticalThumb = useRef<HTMLDivElement>(null);

	const refs = useMemo<Record<ElementType, RefObject<HTMLDivElement>>>(() => ({
		content, horizontalTrack, horizontalThumb, verticalTrack, verticalThumb,
	}), []);

	const [elements, setElements] = useState<Elements>();
	useEffect(() => {
		const getElements = (): undefined | Elements => {
			const result = mapObject(refs, (ref) => ref.current);
			if (someObject(result, (value) => !value)) return undefined;
			return result as Record<ElementType, HTMLDivElement>;
		};
		setElements(getElements());
	}, [refs]);

	return {
		refs,
		elements,
	};
};

const updateScrolls = (elements: Elements): void => {
	const { content, horizontalTrack, verticalTrack } = elements;

	const x = getHorizontalScrollPosition(content);
	if (x !== undefined) {
		horizontalTrack.classList.remove('hidden');
		updateHorizontalScrollPosition(elements, x);
	} else {
		horizontalTrack.classList.add('hidden');
	}

	const y = getVerticalScrollPosition(content);
	if (y !== undefined) {
		verticalTrack.classList.remove('hidden');
		updateVerticalScrollPosition(elements, y);
	} else {
		verticalTrack.classList.add('hidden');
	}
};

export type ScrollAreaProps = {
	classNames?: {
		root?: string;
	};
};
export const ScrollArea: FC<ScrollAreaProps> = (props) => {
	const { children, classNames } = props;
	const classes = useClasses();

	const { refs, elements } = useRefs();

	const rootName = className({
		[classNames?.root || classes.root]: true,
	});

	useAnimation(() => {
		if (!elements) return;
		updateScrolls(elements);
	}, [elements]);

	useEffect(() => {
		if (!elements) return undefined;
		const unsubscribeHorizontal = subscribeHorizontalEvents(elements);
		const unsubscribeVertical = subscribeVerticalEvents(elements);
		return () => {
			unsubscribeHorizontal();
			unsubscribeVertical();
		};
	}, [elements]);

	return (
		<div className={rootName}>
			<div ref={refs.content} className={classes.content}>
				{children}
			</div>
			<div ref={refs.horizontalTrack} className={classes.horizontalTrack}>
				<div ref={refs.horizontalThumb} className={classes.horizontalThumb} />
			</div>
			<div ref={refs.verticalTrack} className={classes.verticalTrack}>
				<div ref={refs.verticalThumb} className={classes.verticalThumb} />
			</div>
		</div>
	);
};