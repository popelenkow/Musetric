export const drawChart = (data: Float32Array, canvas: HTMLCanvasElement): void => {
    const ctx = canvas.getContext('2d')!;

    // Очистить предыдущий график
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Настройки графика
    const padding = 0; // Отступы
    const pointsGap = (canvas.width - padding * 2) / (data.length - 1); // Расстояние между точками
    const maxDataValue = Math.max(...data); // Максимальное значение в массиве данных

    // Настройка стиля точек
    ctx.fillStyle = '#ffffff'; // Цвет заливки точек

    // Отрисовка точек
    data.forEach((value, index) => {
        const x = padding + pointsGap * index;
        const y = canvas.height - padding - (value / maxDataValue) * (canvas.height - padding * 2);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
    });
};