export const concatUrls = (...urls: (string | undefined)[]): string => {
	const skipNullOrEmpty = (value?: string): value is string => !!value;
	const trimLeft = (value: string, char: string): string => (
		value.substring(0, 1) === char ? value.substring(1) : value
	);
	const trimRight = (value: string, char: string): string => (
		value.substring(value.length - 1) === char ? value.substring(0, value.length - 1) : value
	);
	return urls
		.map((x) => x && x.trim())
		.filter(skipNullOrEmpty)
		.map((x, i) => (i > 0 ? trimLeft(x, '/') : x))
		.map((x, i, arr) => (i < arr.length - 1 ? trimRight(x, '/') : x))
		.join('/');
};

type ErrorResponse = {
	type: 'error',
	status: number,
	exception: unknown,
	raw: Response,
};

type OkResponse<TResponse> = {
	type: 'ok',
	status: number,
	result: TResponse,
	raw: Response,
};

type CancelResponse = {
	type: 'cancel',
};

export type TypedResponse<TResponse = void> = (
	| OkResponse<TResponse>
	| CancelResponse
	| ErrorResponse
);
export type TypedFetch<TResponse = void> = {
	request: () => Promise<TypedResponse<TResponse>>,
	cancel: () => void,
};

const noCacheHeaders: HeadersInit = {
	'Cache-Control': 'no-cache, no-store, must-revalidate',
	Expires: '0',
	Pragma: 'no-cache',
};

export const isClassicError = (error: unknown): error is Error => {
	if (typeof error === 'object' && error && 'message' in error) return true;
	return false;
};

const isAbortError = (error: unknown): error is DOMException => isClassicError(error) && error.name === 'AbortError';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createHttpClient = (apiUri?: string) => {
	type Options<TResponse> = {
		uri: string,
		method: string,
		toRequest?: (data: unknown) => BodyInit,
		toResponse?: (response: Response) => Promise<TResponse>,
		data?: unknown,
		headers?: HeadersInit,
		signal?: RequestInit['signal'],
	};
	const sendBase = async <TResponse>(
		options: Options<TResponse>,
	): Promise<TypedResponse<TResponse>> => {
		const {
			uri,
			method,
			toRequest = (x): BodyInit => JSON.stringify(x),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			toResponse = (x): Promise<TResponse> => x.json(),
			data,
			headers: requestHeaders = {},
			signal,
		} = options;

		const headers: HeadersInit = {
			...noCacheHeaders,
			...requestHeaders,
		};
		const requestInit: RequestInit = {
			headers,
			method,
			signal,
		};
		if (data) requestInit.body = toRequest(data);

		const raw = await fetch(concatUrls(apiUri, uri), requestInit);
		if (!raw.ok) {
			const exception: unknown = await raw.json();
			return { type: 'error', status: raw.status, exception, raw };
		}
		const result = await toResponse(raw);
		return { type: 'ok', status: raw.status, result, raw };
	};

	const send = <TResponse>(options: Options<TResponse>): TypedFetch<TResponse> => {
		const controller = new AbortController();
		const { signal } = controller;

		const request = async (): Promise<TypedResponse<TResponse>> => {
			try {
				const response = await sendBase<TResponse>({ ...options, signal });
				return response;
			}
			catch (error) {
				if (isAbortError(error)) {
					return {
						type: 'cancel',
					};
				}
				throw error;
			}
		};

		return {
			request,
			cancel: (): void => {
				controller.abort();
			},
		};
	};

	return {
		apiUri,
		getJson: <TResponse>(uri: string) => send<TResponse>({
			uri,
			method: 'get',
		}),
		get: (uri: string) => send({
			uri,
			method: 'get',
			toResponse: () => Promise.resolve(undefined),
		}),
		postJson: <TResponse, TRquest = unknown>(uri: string, data: TRquest) => send<TResponse>({
			uri,
			method: 'post',
			data,
			headers: { Accept: 'application/json', 'content-type': 'application/json' },
		}),
		postFile: <TResponse>(uri: string, file: File) => send<TResponse>({
			uri,
			toRequest: () => {
				const formData = new FormData();
				formData.append('file', file);
				return formData;
			},
			method: 'post',
			data: file,
		}),
		post: <TRquest = unknown>(uri: string, data: TRquest) => send<undefined>({
			uri,
			toResponse: () => Promise.resolve(undefined),
			method: 'post',
			data,
		}),
		putJson: <TResponse>(uri: string, data: unknown) => send<TResponse>({
			uri,
			method: 'put',
			data,
			headers: { Accept: 'application/json', 'content-type': 'application/json' },
		}),
		delete: (uri: string) => send<void>({
			uri,
			method: 'delete',
		}),
	} as const;
};
export type HttpClient = ReturnType<typeof createHttpClient>;
