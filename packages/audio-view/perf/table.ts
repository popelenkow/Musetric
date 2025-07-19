export type Table = {
  table: HTMLTableElement;
  rows: Record<string, HTMLTableRowElement>;
};
export const createTable = (
  captionText: string,
  windowSizes: number[],
  metrics: readonly string[],
): Table => {
  const table = document.createElement('table');
  table.className = 'perf-table';
  const caption = document.createElement('caption');
  caption.textContent = captionText;
  table.appendChild(caption);

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  const metricTh = document.createElement('th');
  metricTh.textContent = 'metric';
  headRow.appendChild(metricTh);
  for (const ws of windowSizes) {
    const th = document.createElement('th');
    th.textContent = String(ws);
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const rows: Record<string, HTMLTableRowElement> = {};
  for (const metric of metrics) {
    const tr = document.createElement('tr');
    const tdMetric = document.createElement('td');
    tdMetric.textContent = metric;
    tr.appendChild(tdMetric);
    for (let i = 0; i < windowSizes.length; i++) {
      const td = document.createElement('td');
      td.textContent = '';
      tr.appendChild(td);
    }
    rows[metric] = tr;
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  return { table, rows };
};
