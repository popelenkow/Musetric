import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { createProjectApi } from '../../../api/endpoints/project.js';
import { routes } from '../../../app/router/routes.js';
import { stripExt } from '../../../common/stripExt.js';
import { SongPlayer } from '../common/SongPlayer.js';
import { NameField } from '../fields/Name/index.js';
import { nameValueSchema } from '../fields/Name/schema.js';
import { PreviewField } from '../fields/Preview/index.js';
import { previewValueSchema } from '../fields/Preview/schema.js';
import { SongField } from '../fields/Song/index.js';
import { songValueSchema } from '../fields/Song/schema.js';

const schema = (t: TFunction) =>
  z.object({
    song: songValueSchema(),
    name: nameValueSchema(t),
    preview: previewValueSchema().optional(),
  });
type FormValue = z.infer<ReturnType<typeof schema>>;

export const CreateDialog: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const create = useMutation(createProjectApi(queryClient));

  const {
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: zodResolver(schema(t)),
  });

  const close = () => routes.projects.navigate();
  const onSubmit = async (value: FormValue) => {
    await create.mutateAsync({
      song: value.song.file,
      name: value.name,
      preview: value.preview?.file,
    });
    close();
  };

  const song = watch('song');

  return (
    <Dialog
      open
      component='form'
      onClose={close}
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>
        <Stack direction='row' alignItems='center' gap={2}>
          <Typography variant='h6'>
            {t('pages.projects.dialogs.create.title')}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <Stack gap={2}>
          {song && (
            <>
              <Controller
                name='preview'
                control={control}
                render={({ field }) => (
                  <PreviewField
                    value={field.value}
                    setValue={field.onChange}
                    loading={create.isPending}
                  />
                )}
              />
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <NameField
                    value={field.value}
                    setValue={field.onChange}
                    error={errors.name?.message}
                    disabled={create.isPending}
                  />
                )}
              />
              <SongPlayer url={song.url} />
            </>
          )}
          {!song && (
            <Controller
              name='song'
              control={control}
              render={({ field }) => (
                <SongField
                  value={field.value}
                  setValue={(newSong) => {
                    field.onChange(newSong);
                    setValue('name', stripExt(newSong.file.name));
                  }}
                  disabled={create.isPending}
                />
              )}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={close} disabled={create.isPending}>
          {t('pages.projects.dialogs.create.cancel')}
        </Button>
        <Button
          type='submit'
          color='primary'
          variant='contained'
          disabled={!song || create.isPending}
          loading={create.isPending}
        >
          {t('pages.projects.dialogs.create.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
