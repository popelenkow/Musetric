import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ProjectInfo } from '@musetric/api';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../../../app/router/routes';

export type ProjectCardMenuProps = {
  projectInfo: ProjectInfo;
};
export const ProjectCardMenu: FC<ProjectCardMenuProps> = (props) => {
  const { projectInfo } = props;

  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  return (
    <>
      <IconButton
        size='small'
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        sx={{ margin: '0 !important' }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(undefined)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          component={routes.projectsEdit.Link}
          params={{ projectId: projectInfo.id }}
          onClick={() => {
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary={t('pages.projects.cards.menu.editProject')} />
        </MenuItem>
        <MenuItem
          component={routes.projectsDelete.Link}
          params={{ projectId: projectInfo.id }}
          onClick={() => {
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText
            primary={t('pages.projects.cards.menu.deleteProject')}
          />
        </MenuItem>
      </Menu>
    </>
  );
};
