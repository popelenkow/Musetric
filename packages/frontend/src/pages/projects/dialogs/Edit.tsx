import { zodResolver } from '@hookform/resolvers/zod';
import DeleteIcon from '@mui/icons-material/Delete';
import DrawIcon from '@mui/icons-material/Draw';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  CircularProgress,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { FC, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  changePreviewApi,
  getPreviewUrl,
} from '../../../api/endpoints/preview';
import {
  getProjectInfoApi,
  renameProjectApi,
} from '../../../api/endpoints/project';
import { routes } from '../../../app/router/routes';
import { QueryError } from '../../../common/QueryView/QueryError';
import { ProjectPreview } from '../cards/Preview';

const schema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, {
        message: t('pages.projects.dialogs.rename.error.emptyName'),
      }),
    preview: z.object({
      type: z.union([z.literal('default'), z.literal('form')]),
      url: z.string().optional(),
      file: z.custom<File>((value) => typeof value === 'object').optional(),
    }),
  });

type FormData = z.infer<ReturnType<typeof schema>>;

export type EditDialogProps = {
  projectId: number;
};
export const EditDialog: FC<EditDialogProps> = (props) => {
  const { projectId } = props;

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const projectInfo = useQuery(getProjectInfoApi(projectId));
  const previewInputRef = useRef<HTMLInputElement>(null);

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { preview: {} },
    resolver: zodResolver(schema(t)),
  });

  useEffect(() => {
    if (!projectInfo.data) return;
    const { name, previewId } = projectInfo.data;
    const url = getPreviewUrl(previewId);
    reset({ name, preview: { type: 'default', url } });
  }, [projectInfo.data, reset]);

  const preview = watch('preview');

  useEffect(() => {
    return () => {
      if (preview.type === 'form' && preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

  const close = () => {
    routes.projects.navigate();
  };

  const rename = useMutation(renameProjectApi(queryClient, projectId));

  const changePreview = useMutation(changePreviewApi(queryClient, projectId));

  const onSubmit = async (data: FormData) => {
    await rename.mutateAsync(data.name);
    if (preview.type === 'form') {
      await changePreview.mutateAsync(data.preview.file);
    }
    close();
  };

  const renderContent = () => {
    if (projectInfo.isError) {
      return <QueryError error={projectInfo.error} />;
    }
    return (
      <>
        <Stack>
          <ProjectPreview url={preview.url}>
            {projectInfo.isPending ? (
              <CircularProgress sx={{ color: 'text.primary' }} />
            ) : null}
          </ProjectPreview>
          <input
            type='file'
            ref={previewInputRef}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setValue('preview', {
                type: 'form',
                file,
                url: URL.createObjectURL(file),
              });
            }}
            style={{ display: 'none' }}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {preview.url ? (
              <Button
                color='error'
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setValue('preview', {
                    type: 'form',
                  });
                }}
              >
                {t('pages.projects.dialogs.edit.erasePreview')}
              </Button>
            ) : (
              <Box />
            )}
            <Button startIcon={<KeyboardDoubleArrowUpIcon />} disabled>
              {t('pages.projects.dialogs.edit.dragFile')}
            </Button>
            <Button
              startIcon={<DrawIcon />}
              disabled={projectInfo.isPending}
              onClick={() => previewInputRef.current?.click()}
            >
              {t('pages.projects.dialogs.edit.selectFile')}
            </Button>
          </Box>
        </Stack>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              rows={3}
              size='small'
              label={t('pages.projects.dialogs.edit.name')}
              disabled={projectInfo.isPending || rename.isPending}
              error={!!errors.name}
              helperText={errors.name?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
              onChange={(event) => {
                const text = event.target.value;
                const newValue = text.replace(/(\r\n|\n|\r)/g, ' ');
                field.onChange(newValue);
              }}
            />
          )}
        />
      </>
    );
  };

  return (
    <Dialog
      open
      scroll='body'
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      onClose={close}
    >
      <DialogTitle>
        <Stack direction='row' alignItems='center' gap={2}>
          <Typography variant='h6'>
            {t('pages.projects.dialogs.edit.title')}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: 450,
        }}
      >
        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={rename.isPending}>
          {t('pages.projects.dialogs.edit.cancel')}
        </Button>
        <Button
          type='submit'
          disabled={rename.isPending || !projectInfo.isSuccess}
          loading={rename.isPending}
          variant='contained'
        >
          {t('pages.projects.dialogs.edit.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
