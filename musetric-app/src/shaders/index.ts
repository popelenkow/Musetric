/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { startAnimation } from 'musetric';
import vertexString from './vertex.glsl';
import fragmentString from './fragment.glsl';

const createShader = (gl: WebGL2RenderingContext, shaderSource: string, shaderType: number) => {
	const shader = gl.createShader(shaderType);
	if (!shader) throw new Error();
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		const lastError = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error(`*** Error compiling shader '${shader}':${lastError}\n${shaderSource.split('\n').map((l, i) => `${i + 1}: ${l}`).join('\n')}`);
	}
	return shader;
};

const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
	const program = gl.createProgram();
	if (!program) throw new Error();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
		const lastError = gl.getProgramInfoLog(program);
		gl.deleteProgram(program);
		throw new Error(`Error in program linking: ${lastError}`);
	}
	return program;
};

const createProgramFromScripts = (gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) => {
	const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
	const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
	return createProgram(gl, vertexShader, fragmentShader);
};

export const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
	if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		return true;
	}
	return false;
};

const waitRender = (gl: WebGL2RenderingContext) => {
	return new Promise<void>((resolve, reject) => {
		const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
		if (!sync) {
			reject(new Error('fenceSync returned null'));
			return;
		}
		gl.flush();

		let its = 0;
		let status: number;
		console.time('2');
		const close = () => {
			if (status === gl.CONDITION_SATISFIED) {
				resolve();
			}
			if (status === gl.WAIT_FAILED) {
				reject(new Error('WAIT_FAILED'));
			}
			if (status === gl.TIMEOUT_EXPIRED) {
				reject(new Error('TIMEOUT_EXPIRED'));
			}
			console.timeEnd('2');
			gl.deleteSync(sync);
		};
		const subscription = startAnimation({
			current: () => {
				status = gl.clientWaitSync(sync, 0, 0);
				if (status === gl.CONDITION_SATISFIED || status === gl.WAIT_FAILED || its++ > 100000) {
					subscription.stop();
					close();
				}
			},
		});
	});
};

export const main = async (canvas: HTMLCanvasElement) => {
	// Get A WebGL context
	const gl = canvas.getContext('webgl2');
	if (!gl) throw new Error('WebGl 2.0 does not support');

	const success = gl.getExtension('EXT_color_buffer_float');
	if (!success) {
		throw new Error('EXT_color_buffer_float does not support');
	}

	// Use our boilerplate utils to compile the shaders and link into a program
	const program = createProgramFromScripts(gl, vertexString, fragmentString);
	// Create a buffer to put three 2d clip space points in
	const positionBuffer = gl.createBuffer();
	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const positions = [
		10, 20,
		80, 20,
		10, 30,
		10, 30,
		80, 20,
		80, 30,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	const vertexArray = gl.createVertexArray();
	gl.bindVertexArray(vertexArray);

	// look up where the vertex data needs to go.
	const aPosition = gl.getAttribLocation(program, 'aPosition');
	// Turn on the attribute
	gl.enableVertexAttribArray(aPosition);
	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	const size = 2; // 2 components per iteration
	const type = gl.FLOAT; // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	const vertexOffset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(aPosition, size, type, normalize, stride, vertexOffset);

	// render
	resizeCanvasToDisplaySize(canvas);
	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	const a = gl.getUniformLocation(program, 'a');
	gl.uniform1i(a, 5);
	// look up uniform locations
	const uResolution = gl.getUniformLocation(program, 'uResolution');
	// set the resolution
	gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);

	const uArr = gl.getUniformLocation(program, 'uArr');
	const arr = new Float32Array(8);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = i / 8;
	}
	gl.uniform1fv(uArr, arr);

	const texture = gl.createTexture();

	// make unit 0 the active texture uint
	// (ie, the unit all other texture commands will affect
	gl.activeTexture(gl.TEXTURE0 + 0);

	// Bind it to texture unit 0' 2D bind point
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the parameters so we don't need mips and so we're not filtering
	// and we don't repeat
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	const width = 8192;
	const height = 2048;
	const text = new Float32Array(width * height);
	for (let i = 0; i < text.length; i++) {
		text[i] = i / (text.length - 1);
	}
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, width, height, 0, gl.RED, gl.FLOAT, text);

	const uImage = gl.getUniformLocation(program, 'uImage');
	gl.uniform1i(uImage, 0);

	// draw
	const primitiveType = gl.TRIANGLES;
	const arraysOffset = 0;
	const count = 6;

	console.time('1');
	gl.drawArrays(primitiveType, arraysOffset, count);

	await waitRender(gl);
	console.timeEnd('1');
	console.time('1');
	gl.useProgram(program);
	for (let i = 0; i < text.length; i++) {
		text[i] = (text.length - i - 1) / (text.length - 1);
	}
	console.time('3');
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, width, height, 0, gl.RED, gl.FLOAT, text);
	console.timeEnd('3');
	gl.drawArrays(primitiveType, arraysOffset, count);

	await waitRender(gl);
	console.timeEnd('1');
};
