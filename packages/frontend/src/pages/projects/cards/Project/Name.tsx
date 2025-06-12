import { Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FC } from 'react';

export type ProjectCardNameProps = {
  name: string;
};
export const ProjectCardName: FC<ProjectCardNameProps> = (props) => {
  const { name } = props;

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={name}
        initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{ clipPath: 'inset(0% 100% 0% 0%)' }}
        transition={{ duration: 0.5 }}
        style={{ overflow: 'hidden' }}
      >
        <Typography
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '3em',
            paddingTop: 1,
            paddingLeft: 1,
          }}
        >
          {name}
        </Typography>
      </motion.div>
    </AnimatePresence>
  );
};
