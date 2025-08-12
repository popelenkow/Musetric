import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export type SeparationMetadata = {
  vocal: {
    filename: string;
    contentType: string;
  };
  instrumental: {
    filename: string;
    contentType: string;
  };
};

export type SeparationProgress = {
  stage: string;
  progress?: number; // Float value from 0 to 1
};

export const separateAudio = async (
  inputPath: string,
  vocalPath: string,
  instrumentalPath: string,
  onProgress?: (progress: SeparationProgress) => void,
): Promise<SeparationMetadata> => {
  const pythonScript = path.join(dirname, 'index.py');

  const args = [
    pythonScript,
    '--input',
    inputPath,
    '--vocal-output',
    vocalPath,
    '--instrumental-output',
    instrumentalPath,
  ];

  const pythonProcess = spawn('uv', ['run', 'python', ...args], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: path.join(dirname, '..', '..'),
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
            if (parsed.stage || parsed.progress !== undefined) {
              onProgress(parsed);
            }
          } catch {
            // Ignore JSON parse errors
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
              metadata = parsed;
              break;
            }
          } catch {
            // Continue looking for valid JSON
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
