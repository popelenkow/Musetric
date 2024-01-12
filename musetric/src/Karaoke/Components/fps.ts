/* eslint-disable @typescript-eslint/consistent-type-assertions */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createFps = () => {
    let time = 50;
    let maxTime = 50;
    let maxEpoch = 0;
    let minTime = 50;
    let minEpoch = 0;
    return {
        draw: (newTime: number, src: string): void => {
            time = time * 0.97 + newTime * 0.03;
            if (maxTime < newTime || maxEpoch === 50) {
                maxTime = newTime;
                maxEpoch = 0;
            }
            if (minTime > newTime || minEpoch === 50) {
                minTime = newTime;
                minEpoch = 0;
            }
            maxEpoch++;
            minEpoch++;

            document.getElementById('1')!.textContent = (maxTime / 1000).toFixed(3);
            document.getElementById('2')!.textContent = (time / 1000).toFixed(3);
            document.getElementById('3')!.textContent = (minTime / 1000).toFixed(3);
            document.getElementById('4')!.textContent = src;
        },
    };
};
