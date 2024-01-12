import React, { useEffect, useMemo, useRef } from 'react';
import { Button, ButtonProps } from '../../../Controls/Button';
import { Icon } from '../../../Controls/Icon';
import { SFC } from '../../../UtilityTypes/React';
import { skipPromise } from '../../../Utils/SkipPromise';
import { createCpuDft } from './cpuDft';
import { createCpuFft } from './cpuFft';
import { createGpuDft } from './gpuDft';
import { createGpuFft } from './gpuFft';

export const Check: SFC = () => {
    const cpuDft = useMemo(() => createCpuDft(), []);
    const cpuFft = useMemo(() => createCpuFft(), []);
    const gpuDft = useRef({ render: async () => {}, init: false });
    const gpuFft = useRef({ render: async () => {}, init: false });
    useEffect(() => {
        if (gpuDft.current.init) return;
        gpuDft.current.init = true;
        const f = async (): Promise<void> => {
            const gpuDftInstance = await createGpuDft();
            gpuDft.current.render = gpuDftInstance.render;
            const gpuFftInstance = await createGpuFft();
            gpuFft.current.render = gpuFftInstance.render;
        };
        skipPromise(f());
    }, []);

    const buttonProps: ButtonProps = {
        kind: 'icon',
        rounded: true,
        onClick: () => {
            const f = async (): Promise<void> => {
                cpuDft.render();
                cpuFft.render();
                await gpuFft.current.render();
                await gpuDft.current.render();
                console.log('--------------');
            };
            skipPromise(f());
        },
    };
    return (
        <Button {...buttonProps}>
            <Icon name='stop' />
        </Button>
    );
};
