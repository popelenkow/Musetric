import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { CardMedia, Stack } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { contentPlaceholderPattern } from '../common/cardBackgroundPattern';

export type ProjectPreviewProps = {
  url?: string;
};
type Props = ProjectPreviewProps & PropsWithChildren;
export const ProjectPreview: FC<Props> = (props) => {
  const { url, children } = props;

  if (!url) {
    return (
      <Stack
        justifyContent='center'
        alignItems='center'
        sx={{
          userSelect: 'none',
          aspectRatio: '16 / 9',
          borderRadius: 2,
          background: contentPlaceholderPattern,
        }}
      >
        {children || <AudiotrackIcon sx={{ fontSize: '46px' }} />}
      </Stack>
    );
  }

  return (
    <CardMedia
      component='img'
      image={url}
      sx={{
        aspectRatio: '16 / 9',
        borderRadius: 2,
        objectFit: 'contain',
      }}
    />
  );
};
