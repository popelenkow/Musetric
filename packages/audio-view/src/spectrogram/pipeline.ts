import { Parameters } from './parameters';

export type PipelineRender = (
  input: Float32Array,
  parameters: Parameters,
) => Promise<void>;

export type Pipeline = {
  resize: () => void;
  render: PipelineRender;
};
