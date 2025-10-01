import { CardActionArea } from '@mui/material';
import { api } from '@musetric/api';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, useEffect } from 'react';
import { routes } from '../../../../app/router/routes.js';
import { ProjectPreview } from '../Preview.js';

const usePreloadImage = (previewUrl?: string) => {
  useEffect(() => {
    if (!previewUrl) return;
    const img = new Image();
    img.src = previewUrl;
  }, [previewUrl]);
};

export type ProjectCardPreviewProps = {
  projectInfo: api.project.Item;
};

export const ProjectCardPreview: FC<ProjectCardPreviewProps> = (props) => {
  const { projectInfo } = props;
  const { previewUrl } = projectInfo;

  usePreloadImage(previewUrl);

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={previewUrl}
        initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{ clipPath: 'inset(0% 100% 0% 0%)' }}
        transition={{ duration: 0.5 }}
        style={{ overflow: 'hidden' }}
      >
        <CardActionArea
          component={routes.project.Link}
          params={{ projectId: projectInfo.id }}
        >
          <ProjectPreview url={previewUrl} />
        </CardActionArea>
      </motion.div>
    </AnimatePresence>
  );
};
