import type Hapi from '@hapi/hapi';
import { getRequest, setResponse, type Router } from 'better-call';

export function toHapiHandler(handler: Router['handler']) {
	return async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const req = request.raw.req;
		const res = request.raw.res;
		const protocol = (req.socket as any)?.encrypted ? 'https' : 'http';
		const base = `${protocol}://${req.headers[':authority'] || req.headers.host}`;
		const response = await handler(getRequest({ base, request: req }));
		setResponse(res, response);
		return h.abandon;
	};
};
