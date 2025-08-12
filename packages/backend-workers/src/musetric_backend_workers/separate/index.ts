import { spawn } from 'child_process';
import { envs } from '../envs.js';

export type FileMetadata = {
  filename: string;
  contentType: string;
};

export type SeparationMetadata = {
  vocal: FileMetadata;
  instrumental: FileMetadata;
};

export type SeparationProgressEvent = {
  type: 'progress';
  stage: string;
  progress: number;
};

export type SeparationFinishEvent = {
  type: 'finish';
  vocal: FileMetadata;
  instrumental: FileMetadata;
};

export type SeparationEvent = SeparationProgressEvent | SeparationFinishEvent;

export type SeparationProgress = {
  stage: string;
  progress?: number;
};

export const separateAudio = async (
  inputPath: string,
  vocalPath: string,
  instrumentalPath: string,
  onProgress?: (progress: SeparationProgress) => void,
): Promise<SeparationMetadata> => {
  const scriptArgs = {
    '--input': inputPath,
    '--vocal-output': vocalPath,
    '--instrumental-output': instrumentalPath,
  };

  const args = [
    'run',
    'python',
    envs.separateScriptPath,
    ...Object.entries(scriptArgs).flat(),
  ];

  const pythonProcess = spawn('uv', args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: envs.rootPath,
    shell: true,
  });

  let stdout = '';
  let stderr = '';

  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;

      const lines = output.split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('{') && onProgress) {
          try {
            const parsed = JSON.parse(line.trim());
            if (parsed.type === 'progress') {
              onProgress({
                stage: parsed.stage,
                progress: parsed.progress,
              });
            } else if (parsed.progress !== undefined && parsed.stage) {
              onProgress({
                stage: parsed.stage,
                progress: parsed.progress,
              });
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed with code ${code}: ${stderr}`));
        return;
      }

      const lines = stdout.split('\n');
      let metadata: SeparationMetadata | undefined = undefined;

      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('{')) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.vocal && parsed.instrumental) {
              metadata = {
                vocal: parsed.vocal,
                instrumental: parsed.instrumental,
              };
              break;
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      if (metadata === undefined) {
        reject(
          new Error(
            `Failed to parse metadata from Python script output: ${stdout}`,
          ),
        );
        return;
      }

      resolve(metadata);
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python script: ${error.message}`));
    });
  });
};
