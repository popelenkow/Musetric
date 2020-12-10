import { Recorder } from './recorder';

export type Model = {
	recorder: Recorder;
	audioContext: AudioContext;
	analyserNode: AnalyserNode;
}
