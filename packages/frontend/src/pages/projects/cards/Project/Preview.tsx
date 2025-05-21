import { CardActionArea } from '@mui/material';
import { ProjectInfo } from '@musetric/api';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, useEffect } from 'react';
import { getPreviewUrl } from '../../../../api/endpoints/preview';
import { routes } from '../../../../app/router/routes';
import { ProjectPreview } from '../Preview';

const usePreloadImage = (previewUrl?: string) => {
  useEffect(() => {
    if (!previewUrl) return;
    const img = new Image();
    img.src = previewUrl;
  }, [previewUrl]);
};

export type ProjectCardPreviewProps = {
  projectInfo: ProjectInfo;
};

export const ProjectCardPreview: FC<ProjectCardPreviewProps> = (props) => {
  const { projectInfo } = props;
  const { previewId } = projectInfo;
  const previewUrl = getPreviewUrl(previewId);

  usePreloadImage(previewUrl);

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={projectInfo.previewId}
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
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
