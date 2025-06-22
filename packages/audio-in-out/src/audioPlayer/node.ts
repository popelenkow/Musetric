import playerWorkletUrl from './worklet.ts?worker&url';

export const createPlayerNode = async (
  context: AudioContext,
): Promise<AudioWorkletNode> => {
  await context.audioWorklet.addModule(playerWorkletUrl);
  const node = new AudioWorkletNode(context, 'player-processor', {
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });
  node.connect(context.destination);
  return node;
};
