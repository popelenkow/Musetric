# Задача: Система фонового разделения треков в Musetric

## Описание

Реализовать систему фонового разделения треков на вокальную и инструментальную партии с отображением прогресса на фронтенде.

## Требования на весь документ

- не писать нигде коментарии
- по максимуму избавиться от косоль логов, оставлять только ошибки
- не писать нигде в коде пояснения

## Структура данных

**База данных**: [packages/backend/schema.prisma](packages/backend/schema.prisma)

- `ProjectStage`: pending → progress → done
- `SoundType`: original, vocal, instrumental

**API эндпоинты**:

- Projects: [packages/api/src/routes/project.ts](packages/api/src/routes/project.ts)
- Sounds: [packages/api/src/routes/sound.ts](packages/api/src/routes/sound.ts)

**Python скрипт**: [packages/backend-workers/src/separate.py](packages/backend-workers/src/separate.py)

## Требования

### 1. Backend Workers

#### 1.1 ✅ Создать функцию separateAudio

**Файл**: [packages/backend-workers/src/separate.ts](packages/backend-workers/src/separate.ts)

- Экспорт `separateAudio(inputPath: string, vocalPath: string, instrumentalPath: string)`
- `child_process.spawn` для запуска Python скрипта с аргументами
- Парсинг stdout для получения JSON метаданных что требуется ивенты делать типизированными. type progress и type finish
- Возврат `Promise<{vocal: {filename, contentType}, instrumental: {filename, contentType}}>`
- onProgress?: (progress: SeparationProgress) => void; обязательное поле
- Обработка stderr для ошибок с выбросом исключений

#### 1.2 ✅ Модифицировать separate.py для CLI

**Файл**: [packages/backend-workers/src/separate.py](packages/backend-workers/src/separate.py)

- Добавить `argparse` для CLI аргументов: `--input`, `--vocal-output`, `--instrumental-output`
- Заменить константы на аргументы командной строки
- Модифицировать `Separator` для записи в конкретные пути
- Вывод JSON метаданных в stdout (формат см. в packages/backend-workers/src/separate.py:62-68)

#### 1.4 ✅ Разделить Python зависимости

**Обновить**: [packages/backend-workers/pyproject.toml](packages/backend-workers/pyproject.toml) с разделением зависимостей на production и dev группы

#### 1.5 ✅ Настроить GitHub CI

**Обновить**: [.github/workflows/check.yml](.github/workflows/check.yml):

- Использовать `ci-check=true yarn` для установки только линтеров
- Python lint и TypeScript проверки встроены в существующие команды
- CI остается быстрым без GPU библиотек

#### 1.6 ✅ Обновить Yarn workspace установку

**Обновить**: [packages/backend-workers/package.json](packages/backend-workers/package.json) со скриптами для условной установки зависимостей

- По умолчанию (`yarn`): все зависимости (prod + dev)
- CI mode (`ci-check=true yarn`): только dev зависимости (линтеры)

#### 1.7 ✅ Добавить отправку прогресса из Python скрипта

**КРИТИЧЕСКИЕ ТРЕБОВАНИЯ - ТОЛЬКО РЕАЛЬНЫЙ ПРОГРЕСС**:

**ЗАПРЕЩЕНО**:

- ❌ **Любые time-based оценки прогресса** (elapsed/duration estimates)
- ❌ **Фиксированные значения прогресса** (0.1, 0.2, 0.8, etc.)
- ❌ **Имитация или угадывание прогресса** по времени
- ❌ **Искусственные этапы** или фейковый прогресс
- ❌ **Fallback прогресс** основанный на времени обработки

**ТРЕБУЕТСЯ ТОЛЬКО**:

- ✅ **100% реальный прогресс** от audio-separator библиотеки
- ✅ **Точное отслеживание** какая часть аудиофайла уже обработана
- ✅ **Реальные данные** от нейронной сети о состоянии обработки
- ✅ **Подлинный прогресс** от tqdm внутри audio-separator
- ✅ **Нулевых имитаций** - только реальное состояние процесса

**✅ РЕАЛИЗОВАНО**:

- ✅ **Полностью реальный прогресс**: Убраны ВСЕ time estimates и фиксированные значения
- ✅ **Только нейронная сеть**: Прогресс отражает реальную обработку chunks/batches аудио
- ✅ **Нулевых имитаций**: Удалены все источники фейкового прогресса
- ✅ **Monkey patching tqdm**: CustomTqdm перехватывает реальный прогресс из audio-separator библиотеки
- ✅ **Убран весь time-based код**: Никаких временных оценок или угадываний

**Тестовый скрипт для проверки реального прогресса**:

```bash
# Перейти в директорию backend-workers
cd packages/backend-workers

# Запустить разделение с реальным прогрессом
./.venv/Scripts/python.exe src/separate/index.py --input "../../tmp/apt.mp3" --vocal-output "../../tmp/apt_vocal.flac" --instrumental-output "../../tmp/apt_instrumental.flac"
```

**Ожидаемый результат**:

- Прогресс будет плавно идти от 0.0 до 1.0
- Каждое обновление будет отражать реальную обработку нейронной сетью
- Никаких скачков с 0% на 22% или фиксированных значений
- JSON вывод: `{"progress": 0.25, "stage": "separating"}` означает 25% аудио обработано

### 2. Backend API

#### 2.1 ✅ Добавить API эндпоинт прогресса

**Добавить в**: [packages/api/src/routes/project.ts](packages/api/src/routes/project.ts) namespace progress с API роутом для получения прогресса проекта

#### 2.2 ✅ Реализовать обработчик прогресса

**Добавить в**: [packages/backend/src/routers/project.ts](packages/backend/src/routers/project.ts) обработчик для progress роута с проверкой доступных треков и возвратом статуса

#### 2.3 ✅ Создать глобальное состояние обработки

**Реализовано**: [packages/backend/src/services/separationState.ts](packages/backend/src/services/separationState.ts) управляет состоянием обработки

**Реализовано**:

- Map с состоянием каждого обрабатываемого projectId
- Интерфейс: `{ projectId: number, blobId: string, progress: number, stage: string }`
- Функции: `setSeparationProgress()`, `getSeparationProgress()`, `clearSeparationProgress()`, `getAllSeparationStates()`
- **Хранение в памяти**: Проценты прогресса хранятся в переменной в памяти backend'а
- **Автоматический сброс**: При перезапуске backend все состояния обработки сбрасываются, новые процессы начинают с 0%

#### 2.4 ✅ Создать фоновый worker для разделения треков

**Реализовано**: [packages/backend/src/routers/project.ts](packages/backend/src/routers/project.ts) содержит полный фоновый worker

**Реализовано**:

- Функции `processSeparationQueue()` и `processProjectSeparation()` для обработки очереди
- Импорт `separateAudio` из @musetric/backend-workers
- Интеграция с blob storage для сохранения результатов
- `setInterval` каждые 10 секунд для периодической обработки
- Автоматический запуск worker при инициализации роутера

**ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ**:

- **Последовательная обработка**: Треки ДОЛЖНЫ обрабатываться строго по очереди, по одному проекту за раз
- **Никакой параллельной обработки**: В любой момент времени может обрабатываться только один проект
- **Очередь FIFO**: Проекты обрабатываются в порядке поступления (первый пришел - первый обслужен)

#### 2.5 ✅ Модифицировать обработчик прогресса для реального времени

**Реализовано**: [packages/backend/src/routers/project.ts](packages/backend/src/routers/project.ts) в обработчике progress роута

**Реализовано**:

- Импорт separationState функций
- Получение реального прогресса из `getSeparationProgress(projectId)` когда project.stage === 'progress'
- Возврат `progressPercent` из состояния или undefined для других стадий

#### 2.6 ✅ Интегрировать состояние в worker обработки

**Реализовано**: [packages/backend/src/routers/project.ts](packages/backend/src/routers/project.ts) в функции processProjectSeparation

**Реализовано**:

- Импорт всех separationState функций
- Установка прогресса при переходах init→pending→progress→done через `setSeparationProgress()`
- Callback onProgress в separateAudio обновляет реальный прогресс в реальном времени
- `clearSeparationProgress()` при завершении (успех) и ошибках

#### 2.7 ✅ Обновить Docker конфигурацию

**Обновить**: [packages/backend/Dockerfile](packages/backend/Dockerfile) с поддержкой Python и uv для запуска separateAudio

**Требует**: добавить Python, uv, установку backend-workers зависимостей, многоэтапную сборку

### 3. Frontend

#### 3.1 ✅ Создать компонент индикатора прогресса

**Создать**: [packages/frontend/src/pages/project/ProgressIndicator.tsx](packages/frontend/src/pages/project/ProgressIndicator.tsx) - компонент с LinearProgress и polling каждые 5 секунд (функция getStageText на строке 25)

**ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ**:

- **Автоматический опрос**: Компонент ДОЛЖЕН опрашивать сервер каждые 5 секунд для получения актуального статуса
- **Независимый опрос**: Опрос должен работать независимо от действий пользователя
- **Обновление UI**: При изменении статуса интерфейс должен обновляться автоматически
- **Отображение процентов**: Компонент ДОЛЖЕН отображать прогресс в процентах (числовое значение) рядом с прогресс-баром
- **Хранение в памяти**: Проценты прогресса хранятся в переменной в памяти backend'а
- **Восстановление после сбоя**: Если процесс умирает, backend запускается заново и начинает новое разделение с 0%

#### 3.2 ✅ Обновить тип Project в API схемах

**Проверить**: packages/api/src/routes/project.ts - убедиться что ProjectResponse включает поле stage

**Требует**: добавить stage в responseSchema если отсутствует

#### 3.3 ✅ Добавить перевод статусов проектов

**Обновить**: [packages/frontend/src/translations/en.json](packages/frontend/src/translations/en.json) с переводами для статусов проектов

**Требует**: добавить ключи для init, pending, progress, done статусов, обновить ProgressIndicator для использования t()

#### 3.4 ✅ Интегрировать прогресс в страницу проекта

**Обновить**: [packages/frontend/src/pages/project/index.tsx](packages/frontend/src/pages/project/index.tsx) - импорт и интеграция ProgressIndicator компонента

**Требует**: добавить импорт ProgressIndicator и вставить компонент в JSX

#### 3.5 ✅ Добавить статус в список проектов

**Реализовано**: [packages/frontend/src/pages/projects/cards/Project/index.tsx](packages/frontend/src/pages/projects/cards/Project/index.tsx) отображает статус проекта

**Реализовано**:

- Импорт Chip из @mui/material
- Функция `getStageChip()` для маппинга stage → цвет/текст с переводами
- Интеграция Chip компонента в JSX карточки проекта
- Цвета: init=default, pending=warning, progress=info, done=success

**ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ**:

- **Автоматическое обновление статусов**: Страница списка проектов ДОЛЖНА автоматически перезапрашивать статусы каждые 5 секунд
- **Реальное время**: Пользователь должен видеть изменения статуса без обновления страницы
- **Глобальный опрос**: Опрос должен работать на странице списка проектов для обновления всех карточек одновременно

#### 3.6 ✅ Реализовать умное воспроизведение треков

**Модифицировать**: [packages/frontend/src/pages/project/store/player.ts](packages/frontend/src/pages/project/store/player.ts) с умной логикой выбора трека

**Требует**: функция loadSmartTrack с приоритетом vocal → original, автопереключение при появлении vocal трека

#### 3.7 ✅ Добавить автоматический опрос статуса в список проектов

**Модифицировать**: [packages/frontend/src/pages/projects/index.tsx](packages/frontend/src/pages/projects/index.tsx) - добавить useInterval для опроса статусов каждые 5 секунд

**Требует**:

- Автоматический перезапрос данных проектов каждые 5 секунд
- Обновление статусов проектов в реальном времени без действий пользователя
- Использование React Query для кеширования и автоматического обновления

#### 3.8 ✅ Обеспечить последовательную обработку треков в backend

**Модифицировать**: [packages/backend/src/routers/project.ts](packages/backend/src/routers/project.ts) - гарантировать обработку только одного проекта за раз

**Требует**:

- Проверка активных процессов разделения перед запуском нового
- Блокировка параллельной обработки нескольких проектов
- Очередь FIFO для ожидающих проектов
- Логирование состояния очереди обработки

### 4. ✅ Исправлены проблемы с запуском

#### 4.1 ✅ Удален временный separationWorker.ts

**Проблема**: Backend пытался импортировать несуществующий модуль `separationWorker` из `packages/backend/src/common/separationWorker.ts`

**Решение**:

- Удален временный файл `separationWorker.ts`
- Убран импорт `startSeparationWorker` из `packages/backend/src/index.ts`
- Worker для разделения треков уже реализован в `packages/backend/src/routers/project.ts` и запускается автоматически при инициализации роутера

#### 4.2 ✅ Yarn dev работает корректно

**Статус**: Development серверы запускаются без ошибок:

- Frontend: https://localhost:3001 и https://localhost:3002
- Backend: https://localhost:3000
- Swagger документация: https://localhost:3000/docs

## План

1. **✅ Фаза 1**: Backend Workers - функция separate.ts + модификация separate.py + CI/CD настройка
2. **✅ Фаза 2**: Backend - логика управления ресурсами + эндпоинт прогресса + Docker настройка
3. **✅ Фаза 3**: Frontend - умное воспроизведение + прогресс
4. **✅ Фаза 4**: Исправлены проблемы с запуском development окружения
