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
import { FC, FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createProjectApi } from '../../../api/endpoints/project';
import { routes } from '../../../app/router/routes';

export const CreateDialog: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();

  const create = useMutation(createProjectApi(queryClient));

  const close = () => {
    routes.projects.navigate();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;
    await create.mutateAsync(file);
    close();
  };

  return (
    <Dialog
      open
      component='form'
      onSubmit={handleSubmit}
      onClose={close}
      slotProps={{
        transition: {
          onEntered: () => {
            inputRef.current?.focus();
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
          gap: 2,
          pt: '8px !important',
          width: 400,
        }}
      >
        <input
          type='file'
          accept='audio/*'
          ref={inputRef}
          hidden
          onChange={(e) => {
            const picked = e.target.files?.[0];
            if (picked) setFile(picked);
          }}
        />
        <Button
          variant='outlined'
          onClick={() => inputRef.current?.click()}
          disabled={create.isPending}
        >
          {t('pages.projects.dialogs.create.selectFile')}
        </Button>
        {file && (
          <Typography variant='body2' noWrap>
            {file.name}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={close} disabled={create.isPending}>
          {t('pages.projects.dialogs.create.cancel')}
        </Button>
        <Button
          type='submit'
          variant='contained'
          disabled={!file || create.isPending}
          loading={create.isPending}
        >
          {t('pages.projects.dialogs.create.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
