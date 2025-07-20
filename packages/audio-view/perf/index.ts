import { createGpuContext, isGpuFourierMode } from '../src';
import { getCanvas } from './canvas';
import {
  fourierModes,
  sampleRate,
  windowSizes,
  getMetricKeys,
} from './constants';
import { runPipeline } from './runPipeline';
import { createTable } from './table';
import { waitNextFrame } from './waitNextFrame';

export const run = async () => {
  const canvas = getCanvas();
  const results = document.getElementById('results');
  if (!results) throw new Error('Results element not found');

  const avgContainer = document.createElement('div');
  const firstContainer = document.createElement('div');
  firstContainer.style.display = 'none';
  results.appendChild(avgContainer);
  results.appendChild(firstContainer);

  const toggle = document.getElementById('toggle-first');
  if (toggle && toggle instanceof HTMLInputElement) {
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        firstContainer.style.display = '';
        avgContainer.style.display = 'none';
      } else {
        firstContainer.style.display = 'none';
        avgContainer.style.display = '';
      }
    });
  }

  const percentToggle = document.getElementById('toggle-percent');
  const updatePercentages = () => {
    const showPercent =
      percentToggle instanceof HTMLInputElement && percentToggle.checked;
    const cells =
      results.querySelectorAll<HTMLTableCellElement>('td[data-value]');
    cells.forEach((cell) => {
      const value = Number(cell.dataset.value);
      const total = Number(cell.dataset.total);
      if (
        showPercent &&
        !Number.isNaN(value) &&
        !Number.isNaN(total) &&
        total
      ) {
        cell.textContent = ((value / total) * 100).toFixed(2);
      } else if (!Number.isNaN(value)) {
        cell.textContent = value.toFixed(2);
      }
    });
  };
  if (percentToggle && percentToggle instanceof HTMLInputElement) {
    percentToggle.addEventListener('change', updatePercentages);
    updatePercentages();
  }

  const tableMap: Record<
    string,
    {
      first: {
        table: HTMLTableElement;
        rows: Record<string, HTMLTableRowElement>;
      };
      average: {
        table: HTMLTableElement;
        rows: Record<string, HTMLTableRowElement>;
      };
    }
  > = {};

  for (const mode of fourierModes) {
    const metrics = getMetricKeys(mode);
    const first = createTable(`${mode} first render`, windowSizes, metrics);
    const average = createTable(mode, windowSizes, metrics);
    firstContainer.appendChild(first.table);
    avgContainer.appendChild(average.table);
    tableMap[mode] = { first, average };
  }

  const { device } = await createGpuContext(true);
  const length = sampleRate;
  const wave = new Float32Array(length);
  for (let i = 0; i < length; i++) wave[i] = Math.random() * 2 - 1;

  for (const fourierMode of fourierModes) {
    const targetCanvas = isGpuFourierMode(fourierMode)
      ? canvas.gpu
      : canvas.cpu;

    for (const windowSize of windowSizes) {
      const { first, average } = await runPipeline(
        fourierMode,
        windowSize,
        wave,
        device,
        targetCanvas,
      );

      const colIndex = windowSizes.indexOf(windowSize) + 1;
      const tables = tableMap[fourierMode];
      const showPercent =
        percentToggle instanceof HTMLInputElement && percentToggle.checked;
      for (const metric of Object.keys(first)) {
        const row = tables.first.rows[metric];
        if (row) {
          const cell = row.children[colIndex];
          if (cell instanceof HTMLTableCellElement) {
            const value = first[metric];
            const total = first.total;
            cell.dataset.value = String(value);
            cell.dataset.total = String(total);
            cell.textContent =
              showPercent && total
                ? ((value / total) * 100).toFixed(2)
                : value.toFixed(2);
          }
        }
      }

      for (const metric of Object.keys(average)) {
        const row = tables.average.rows[metric];
        if (row) {
          const cell = row.children[colIndex];
          if (cell instanceof HTMLTableCellElement) {
            const value = average[metric];
            const total = average.total;
            cell.dataset.value = String(value);
            cell.dataset.total = String(total);
            cell.textContent =
              showPercent && total
                ? ((value / total) * 100).toFixed(2)
                : value.toFixed(2);
          }
        }
      }
      updatePercentages();
      await waitNextFrame(15);
    }
  }
};

void run();
