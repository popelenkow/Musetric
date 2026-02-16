import { api } from '@musetric/api';
import {
  createPortMessageHandler,
  wrapMessagePort,
} from '@musetric/resource-utils/messagePort';
import axios from 'axios';
import { type ViewColors } from '../common/index.js';
import { createPipeline, type Pipeline } from './pipeline.js';
import {
  type FromWaveformMessage,
  type ToWaveformMessage,
} from './protocol.js';

declare const self: DedicatedWorkerGlobalScope;

type State = {
  canvas?: OffscreenCanvas;
  wave?: Float32Array<ArrayBuffer>;
  pipeline?: Pipeline;
  progress: number;
  colors?: ViewColors;
};

const state: State = {
  progress: 0,
};

const port = wrapMessagePort(self).typed<
  ToWaveformMessage,
  FromWaveformMessage
>();

const initializePipeline = () => {
  const { canvas, colors } = state;
  if (!canvas || !colors) return;
  state.pipeline = createPipeline(canvas, colors);
};

const render = (): boolean => {
  const { wave, pipeline, progress } = state;
  if (!wave || !pipeline) return false;
  pipeline.render(wave, progress);
  return true;
};

const loadWave = async (projectId: number, waveType: api.wave.Type) => {
  try {
    const wave = await api.wave.get.request(axios, {
      params: { projectId, type: waveType },
    });
    state.wave = wave;
    port.postMessage({
      type: 'state',
      status: 'success',
    });
    render();
  } catch {
    port.postMessage({
      type: 'state',
      status: 'error',
    });
  }
};

port.onmessage = createPortMessageHandler<ToWaveformMessage>({
  init: (message) => {
    state.colors = message.colors;
    state.progress = message.progress;
    port.postMessage({
      type: 'state',
      status: 'pending',
    });
    void loadWave(message.projectId, message.waveType);
  },
  attachCanvas: (message) => {
    state.canvas = message.canvas;
    initializePipeline();
    render();
  },
  progress: (message) => {
    state.progress = message.progress;
    render();
  },
  colors: (message) => {
    state.colors = message.colors;
    initializePipeline();
    render();
  },
  resize: (message) => {
    if (!state.canvas) return;
    state.canvas.width = message.viewSize.width;
    state.canvas.height = message.viewSize.height;
    render();
  },
});
