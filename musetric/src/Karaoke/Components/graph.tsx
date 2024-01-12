/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
import { drawChart } from './chart';
import { createFps } from './fps';
import { createTimingHelper } from './TimingHelper';

export const createGraph = (device: GPUDevice) => {
    const timingHelper = createTimingHelper(device);
    const fps = createFps();

    const array = new Float32Array(200).fill(0);

    const addItem = (value: number): void => {
        for (let i = 1; i < array.length; i++) {
            array[i - 1] = array[i];
        }
        array[array.length - 1] = value; // Заполняем последний элемент нулем после сдвига
    };

    const chart = document.getElementById('myChart') as HTMLCanvasElement;

    return {
        beginRenderPass: timingHelper.beginRenderPass,
        beginComputePass: timingHelper.beginComputePass,
        render: async (mode: 'skip' | 'cpu' | 'gpu', elapsedTime: number, src: string) => {
            const newTime = (await timingHelper.getResult()) / 1000 / 1000;
            const time = mode === 'cpu' ? elapsedTime : newTime;
            if (mode === 'skip') return;
            fps.draw(time * 1000, (mode === 'cpu' ? 'cpu ' : 'gpu ') + src);
            addItem(time * 1000 * 1000);
            drawChart(array, chart);
        },
    };
};
