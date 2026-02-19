import { Stack } from '@mui/material';
import { type FC, type ReactNode } from 'react';
import { ProjectBackButton } from './ProjectBackButton.js';

export type ProjectLayoutProps = {
  children: ReactNode;
  heading?: ReactNode;
};
export const ProjectLayout: FC<ProjectLayoutProps> = (props) => {
  const { children, heading } = props;
  const headingContent = heading ?? <ProjectBackButton />;

  return (
    <Stack height='100dvh' position='relative'>
      <Stack
        direction='row'
        padding={4}
        gap={2}
        alignItems='center'
        position='relative'
      >
        {headingContent}
      </Stack>
      {children}
    </Stack>
  );
};
