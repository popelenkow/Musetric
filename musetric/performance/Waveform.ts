import benchmark from 'benchmark';
import { createConsoleLog } from '../src/AppBase/Log';
import { parseColor } from '../src/Rendering/Color';
import { Size2D } from '../src/Rendering/Layout';
import { drawWaveform, evalWaves, Waves, WaveformColors } from '../src/Rendering/Waveform';

const log = createConsoleLog();
export const performanceWaveform = (): void => {
    const suite = new benchmark.Suite();
    const colors: WaveformColors = {
        background: parseColor('uint32', 'black'),
        content: parseColor('uint32', 'white'),
    };
    const run = (width: number, height: number, sec: number): void => {
        const frame: Size2D = {
            width,
            height,
        };
        const output = new Uint8ClampedArray(frame.width * frame.height);
        const input = new Float32Array(44000 * sec);
        const analysis: Waves = {
            minArray: new Float32Array(frame.height),
            maxArray: new Float32Array(frame.height),
        };
        suite.add(`drawWaveform [${frame.width}x${frame.height}] sec ${sec}`, () => {
            evalWaves(input, analysis, frame);
            drawWaveform(analysis, output, frame, colors);
        });
    };
    const runSec = (): void => {
        const width = 600;
        const height = 600;
        for (let sec = 10; sec <= 60; sec += 10) {
            run(width, height, sec);
        }
    };
    const runWidth = (): void => {
        const height = 600;
        const sec = 40;
        for (let width = 400; width <= 800; width += 200) {
            run(width, height, sec);
        }
    };
    const runHeight = (): void => {
        const width = 600;
        const sec = 40;
        for (let height = 400; height <= 800; height += 200) {
            run(width, height, sec);
        }
    };
    runSec();
    runWidth;
    runHeight;
    suite.on('cycle', (event: any) => {
        log.info(String(event.target));
    });
    suite.on('complete', (ev: any) => {
        ev;
    });
    suite.run({ async: false });
};
