import numpy as np
import time

# Создание массива случайных чисел размером 2048
data = np.random.rand(2048)

# Инициализация переменной для измерения времени
start_time = time.perf_counter()
fft_result = np.fft.fft(data)
end_time = time.perf_counter()

# Расчет затраченного времени в миллисекундах
time_elapsed_ms = (end_time - start_time) * 1000

# Вывод затраченного времени с улучшенной точностью
print(f"Время выполнения FFT: {time_elapsed_ms:.3f} мс")