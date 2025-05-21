import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { FC, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { createProjectApi } from '../../../api/endpoints/project';
import { routes } from '../../../app/router/routes';

const schema = (t: TFunction) =>
  z.object({
    projectName: z
      .string()
      .trim()
      .min(1, {
        message: t('pages.projects.dialogs.create.error.emptyName'),
      }),
  });

type FormData = z.infer<ReturnType<typeof schema>>;

export const CreateDialog: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema(t)),
    defaultValues: { projectName: '' },
  });

  const create = useMutation(createProjectApi(queryClient));

  const close = () => {
    routes.projects.navigate();
  };

  const onSubmit = async (data: FormData) => {
    await create.mutateAsync(data.projectName);
    close();
  };

  return (
    <Dialog
      open
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      onClose={close}
      slotProps={{
        transition: {
          onEntered: () => {
            if (!inputRef.current) return;
            inputRef.current.focus();
          },
        },
      }}
    >
      <DialogTitle>
        <Stack direction='row' alignItems='center' gap={2}>
          <Typography variant='h6'>
            {t('pages.projects.dialogs.create.title')}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '8px !important',
          width: 400,
        }}
      >
        <Controller
          name='projectName'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              inputRef={inputRef}
              label={t('pages.projects.dialogs.create.projectName')}
              disabled={create.isPending}
              error={!!errors.projectName}
              helperText={errors.projectName?.message}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={close} disabled={create.isPending}>
          {t('pages.projects.dialogs.create.cancel')}
        </Button>
        <Button
          type='submit'
          disabled={create.isPending}
          loading={create.isPending}
          variant='contained'
        >
          {t('pages.projects.dialogs.create.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
