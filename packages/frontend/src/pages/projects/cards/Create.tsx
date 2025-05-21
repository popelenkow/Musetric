import AddIcon from '@mui/icons-material/Add';
import { Card, CardActionArea, CardActions, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../../app/router/routes';
import { ProjectPreview } from './Preview';

export const CreateCard: FC = () => {
  const { t } = useTranslation();

  return (
    <Card
      component={motion.div}
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.4 } }}
      sx={{ background: 'none', boxShadow: 'none' }}
    >
      <CardActionArea
        component={routes.projectsCreate.Link}
        sx={{
          aspectRatio: '16 / 9',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <ProjectPreview>
          <AddIcon sx={{ fontSize: '54px' }} />
        </ProjectPreview>
      </CardActionArea>
      <CardActions
        sx={{
          display: 'flex',
          alignItems: 'start',
          padding: 0,
        }}
      >
        <Typography paddingLeft={1} paddingTop={1} height='3em'>
          {t('pages.projects.cards.create.title')}
        </Typography>
      </CardActions>
    </Card>
  );
};
