/* eslint-disable @typescript-eslint/no-unsafe-return */
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

type OkResponse<TR> = {
	type: 'ok',
	status: number,
	result: TR,
	raw: Response,
};

type CancelResponse = {
	type: 'cancel',
};

export type TypedResponse<TR = void> = CancelResponse | ErrorResponse | OkResponse<TR>;
export type TypedFetch<TR = void> = {
	request: () => Promise<TypedResponse<TR>>,
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
	type Options<TR> = {
		uri: string,
		toRequest?: (data: unknown) => BodyInit,
		toResponse?: (response: Response) => Promise<TR>,
		method?: string,
		data?: unknown,
		headers?: HeadersInit,
		signal?: RequestInit['signal'],
	};
	const sendBase = async <TR>(options: Options<TR>): Promise<TypedResponse<TR>> => {
		const {
			uri,
			toRequest = (x): BodyInit => JSON.stringify(x),
			toResponse = (x): Promise<TR> => x.json(),
			method = 'get',
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

	const send = <TR>(options: Options<TR>): TypedFetch<TR> => {
		const controller = new AbortController();
		const { signal } = controller;

		const request = async (): Promise<TypedResponse<TR>> => {
			try {
				const response = await sendBase<TR>({ ...options, signal });
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
		getJson: <TR>(uri: string) => send<TR>({
			uri,
		}),
		postJson: <TR, Req = unknown>(uri: string, data: Req) => send<TR>({
			uri,
			method: 'post',
			data,
			headers: { Accept: 'application/json', 'content-type': 'application/json' },
		}),
		postFile: <TR>(uri: string, file: File) => send<TR>({
			uri,
			toRequest: () => {
				const formData = new FormData();
				formData.append(file.name, file);
				return formData;
			},
			method: 'post',
			data: file,
		}),
		post: <Req = unknown>(uri: string, data: Req) => send<undefined>({
			uri,
			// eslint-disable-next-line @typescript-eslint/require-await
			toResponse: async () => undefined,
			method: 'post',
			data,
		}),
		putJson: <TR>(uri: string, data: unknown) => send<TR>({
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
