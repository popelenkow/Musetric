import { Card, CardActions } from '@mui/material';
import { api } from '@musetric/api';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { ProjectCardMenu } from './Menu.js';
import { ProjectCardName } from './Name.js';
import { ProjectCardPreview } from './Preview.js';
import { StatusOverlay } from './StatusOverlay.js';

export type ProjectCardProps = {
  projectInfo: api.project.Item;
};
export const ProjectCard: FC<ProjectCardProps> = (props) => {
  const { projectInfo } = props;

  return (
    <Card
      component={motion.div}
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.6 } }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.35 } }}
      sx={{ background: 'none', boxShadow: 'none' }}
    >
      <StatusOverlay projectInfo={projectInfo}>
        <ProjectCardPreview projectInfo={projectInfo} />
      </StatusOverlay>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          padding: 0,
        }}
      >
        <ProjectCardName name={projectInfo.name} />
        <ProjectCardMenu projectInfo={projectInfo} />
      </CardActions>
    </Card>
  );
};
