import { Position2D } from '../../Rendering/Layout';

export type InertiaOptions = {
	resistance: number;
	friction: number;
	sampleCount: number;
};
export type Inertia = {
	setDelta: (delta: Position2D, time: number) => void;
	getDelta: (time: number) => Position2D;
	stop: () => void;
};
export const createInertia = (options: InertiaOptions): Inertia => {
	const { resistance, friction, sampleCount } = options;

	type DeltaInfo = {
		delta: Position2D;
		time: number;
	};
	let deltas: DeltaInfo[] = [];
	let velocity: Position2D = { x: 0, y: 0 };
	const computeVelocityByDeltas = () => {
		const result: Position2D = { x: 0, y: 0 };
		for (let i = 0; i < deltas.length; i++) {
			const info = deltas[i];
			result.x += info.delta.x / info.time;
			result.y += info.delta.y / info.time;
		}
		result.x *= deltas.length;
		result.y *= deltas.length;
		result.x *= Math.log(Math.abs(result.x) + 1) / 10;
		result.y *= Math.log(Math.abs(result.y) + 1) / 10;
		return result;
	};
	const release = () => {
		velocity = computeVelocityByDeltas();
		deltas = [];
	};

	const setDelta = (delta: Position2D, time: number) => {
		deltas = deltas.slice(0, sampleCount - 1);
		deltas.unshift({ delta, time });
	};
	const getDelta = (time: number) => {
		if (deltas.length !== 0) release();
		const result: Position2D = {
			x: velocity.x * time,
			y: velocity.y * time,
		};
		const r = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
		if (velocity.x === 0 && velocity.y === 0) return result;
		const absX = Math.abs(velocity.x);
		const absY = Math.abs(velocity.y);
		const deltaV = (r * resistance + friction) * time;
		velocity.x = Math.sign(velocity.x) * Math.max(0, absX - deltaV * (absX / r));
		velocity.y = Math.sign(velocity.y) * Math.max(0, absY - deltaV * (absY / r));
		return result;
	};
	const stop = () => {
		velocity = { x: 0, y: 0 };
	};
	return {
		setDelta,
		getDelta,
		stop,
	};
};
