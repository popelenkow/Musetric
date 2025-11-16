import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { FC } from 'react';
import { StageStatus } from './stageTypes.js';

export type StageBubbleIconProps = {
  status: StageStatus;
  color: string;
};

export const StageBubbleIcon: FC<StageBubbleIconProps> = (props) => {
  const { status, color } = props;

  if (status === 'done') {
    return <CheckCircleRoundedIcon sx={{ color, fontSize: 26 }} />;
  }
  if (status === 'active') {
    return <GraphicEqIcon sx={{ color, fontSize: 26 }} />;
  }
  return <RadioButtonCheckedIcon sx={{ color, fontSize: 26 }} />;
};
