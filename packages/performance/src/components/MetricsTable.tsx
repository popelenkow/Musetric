import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { type FourierMode } from '@musetric/audio-view';
import { FC } from 'react';
import { getTimerLabels, windowSizes } from '../constants';
import { getMetric } from '../getMetric';
import type { MetricsData } from '../runBenchmarks';

export type MetricsTableProps = {
  mode: FourierMode;
  results: Record<number, MetricsData>;
  showFirst: boolean;
  showPercent: boolean;
};
export const MetricsTable: FC<MetricsTableProps> = (props) => {
  const { mode, results, showFirst, showPercent } = props;

  const metrics = getTimerLabels(mode);
  const theme = useTheme();
  const divider = `1px solid ${theme.palette.divider}`;

  return (
    <TableContainer component={Paper} sx={{ my: 2, width: 'fit-content' }}>
      <Table size='small'>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.action.selected }}>
            <TableCell
              sx={{
                borderRight: divider,
                fontWeight: 'bold',
                minWidth: '125px',
              }}
            >
              {mode}
            </TableCell>
            {windowSizes.map((windowSize, idx) => (
              <TableCell
                key={windowSize}
                align='right'
                sx={{
                  borderRight: idx < windowSizes.length - 1 ? divider : 'none',
                  fontWeight: 'bold',
                }}
              >
                {windowSize}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow
              key={metric}
              sx={{
                '&:nth-of-type(even)': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell
                component='th'
                scope='row'
                sx={{ borderRight: divider }}
              >
                {metric}
              </TableCell>
              {windowSizes.map((windowSize, idx) => {
                const data = results[windowSize];
                const value = getMetric(data, metric, showFirst, showPercent);
                return (
                  <TableCell
                    key={windowSize}
                    align='right'
                    sx={{
                      minWidth: '61px',
                      borderRight:
                        idx < windowSizes.length - 1 ? divider : 'none',
                    }}
                  >
                    {value?.toFixed(2)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
