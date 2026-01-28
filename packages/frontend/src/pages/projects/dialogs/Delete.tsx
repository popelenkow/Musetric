import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { endpoints } from '../../../api/index.js';
import { routes } from '../../../app/router/routes.js';
import { ProjectPreview } from '../cards/Preview.js';

export type DeleteDialogProps = {
  projectId: number;
};
export const DeleteDialog: FC<DeleteDialogProps> = (props) => {
  const { projectId } = props;

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const projectInfo = useQuery(endpoints.project.get(projectId));

  const close = () => {
    routes.projects.navigate();
  };

  const deleteProject = useMutation(
    endpoints.project.remove(queryClient, projectId),
  );

  return (
    <Dialog
      open
      component='form'
      onKeyDown={async (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          await deleteProject.mutateAsync();
          close();
        }
      }}
      onSubmit={async (event) => {
        event.preventDefault();
        await deleteProject.mutateAsync();
        close();
      }}
      onClose={close}
    >
      <DialogTitle>
        <Stack direction='row' alignItems='center' gap={2}>
          <Typography variant='h6'>
            {t('pages.projects.dialogs.delete.title')}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          width: 400,
        }}
      >
        <ProjectPreview url={projectInfo.data?.previewUrl}>
          {projectInfo.isPending && (
            <CircularProgress sx={{ color: 'text.primary' }} />
          )}
        </ProjectPreview>
        <Typography
          px={1}
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {projectInfo.data?.name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={close}
          disabled={deleteProject.isPending}
        >
          {t('pages.projects.dialogs.delete.cancel')}
        </Button>
        <Button
          type='submit'
          variant='contained'
          color='error'
          disabled={deleteProject.isPending || !projectInfo.isSuccess}
          loading={deleteProject.isPending}
        >
          {t('pages.projects.dialogs.delete.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
