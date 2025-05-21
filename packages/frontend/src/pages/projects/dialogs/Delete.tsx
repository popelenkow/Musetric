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
import { getPreviewUrl } from '../../../api/endpoints/preview';
import {
  deleteProjectApi,
  getProjectInfoApi,
} from '../../../api/endpoints/project';
import { routes } from '../../../app/router/routes';
import { ProjectPreview } from '../cards/Preview';
import { contentPlaceholderPattern } from '../common/cardBackgroundPattern';

export type DeleteDialogProps = {
  projectId: number;
};
export const DeleteDialog: FC<DeleteDialogProps> = (props) => {
  const { projectId } = props;

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const projectInfo = useQuery(getProjectInfoApi(projectId));

  const close = () => {
    routes.projects.navigate();
  };

  const deleteProject = useMutation(deleteProjectApi(queryClient, projectId));

  return (
    <Dialog
      open
      component='form'
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          deleteProject.mutate();
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
        <ProjectPreview url={getPreviewUrl(projectInfo.data?.previewId)}>
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
            height: '4.5em',
            background: projectInfo.isPending
              ? contentPlaceholderPattern
              : undefined,
          }}
        >
          {projectInfo.data?.name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={deleteProject.isPending}>
          {t('pages.projects.dialogs.delete.cancel')}
        </Button>
        <Button
          type='submit'
          disabled={deleteProject.isPending || !projectInfo.isSuccess}
          loading={deleteProject.isPending}
          variant='contained'
          color='error'
        >
          {t('pages.projects.dialogs.delete.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
