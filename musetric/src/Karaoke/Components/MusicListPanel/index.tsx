import React from 'react';
import { createUseClasses } from '../../../App/AppCss';
import { themeVariables } from '../../../AppBase/Theme';
import { TopLoader } from '../../../Controls/TopLoader';
import { SFC } from '../../../UtilityTypes/React';
import { skipPromise } from '../../../Utils/SkipPromise';
import { useLoopCallback } from '../../../UtilsReact/Loop';
import { KaraokeSnapshot, useKaraokeStore } from '../../KaraokeContext';
import { MusicListItem, MusicListItemProps } from './Item';

const useClasses = createUseClasses('MusicListPanel', {
    root: {
        background: `var(${themeVariables.backgroundPanel})`,
        'box-sizing': 'border-box',
        height: '100%',
        width: '100%',
        position: 'relative',
    },
    list: {
        display: 'flex',
        'flex-direction': 'column',
    },
    item: {
        display: 'flex',
        'flex-direction': 'row',
        width: '100%',
    },
    itemId: {
        width: '100%',
        'text-align': 'left',
    },
    itemProgress: {
        width: '30px',
    },
});

const select = ({
    isOpenMusicList,
    soundList,
    selectedId,
    selectSound: selectTrack,
    removeSound: removeTrack,
    isMusicListLoading,
    refreshSoundList: refreshMusicList,
}: KaraokeSnapshot) => ({
    isOpenMusicList,
    soundList,
    selectedId,
    selectTrack,
    removeTrack,
    isMusicListLoading,
    refreshMusicList,
} as const);

export const MusicListPanel: SFC<object, { result: 'optional' }> = () => {
    const classes = useClasses();

    const {
        isOpenMusicList, soundList, selectedId, selectTrack, removeTrack,
        isMusicListLoading, refreshMusicList,
    } = useKaraokeStore(select);

    useLoopCallback(() => {
        skipPromise(refreshMusicList());
    }, 10_000);

    if (!isOpenMusicList) return null;

    return (
        <div className={classes.root}>
            {isMusicListLoading && <TopLoader />}
            <div className={classes.list}>
                {soundList.map((info) => {
                    const musicItemProps: MusicListItemProps = {
                        info,
                        selectedId,
                        select: (id) => skipPromise(selectTrack(id)),
                        remove: (id) => skipPromise(removeTrack(id)),
                    };
                    return <MusicListItem key={info.id} {...musicItemProps} />;
                })}
            </div>
        </div>
    );
};
