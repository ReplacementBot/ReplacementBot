import axios, { AxiosResponse } from 'axios';
import http from 'http';
import iconov from 'iconv-lite';
import Logger from '../managers/logger';

export enum HTTPResponseType
{
	SUCCESSFUL,
	BAD_CODE,
	NO_RESPONSE,
	FAILED,
}

export class HTTPResponse
{
	type: HTTPResponseType;
	result: string;
	statusCode: number;
	constructor(type: HTTPResponseType, details?: string, statusCode?: number)
	{
		this.type = type;
		this.result = details;
		this.statusCode = statusCode;
		if(statusCode === undefined)
		{
			statusCode = 0;
		}
	}
	public toString(): string
	{
		switch(this.type)
		{
		case HTTPResponseType.SUCCESSFUL:
			return 'Request Successfully';
		case HTTPResponseType.BAD_CODE:
			return `Server returned bad code (${this.statusCode}`;
		case HTTPResponseType.NO_RESPONSE:
			return 'Server didn\'t send any response in time';
		case HTTPResponseType.FAILED:
			return `Failed to send response $(${this.result})`;
		}
	}
}

export default class WebFetcher
{
	public request(url: string, encoding: string): Promise<HTTPResponse>
	{
		return new Promise((resolve, reject) =>
		{
			axios.get(url,
				{
					responseType: 'arraybuffer',
					headers: { 'User-Agent': 'Replacementbot' },
				})
				.then((response: AxiosResponse<Buffer>) =>
				{
					if(!iconov.encodingExists(encoding))
					{
						reject(new HTTPResponse(HTTPResponseType.FAILED, `WebFetcher Error: "${encoding}" encoding don't exist`));
					}
					resolve(new HTTPResponse(HTTPResponseType.SUCCESSFUL, iconov.decode(response.data, encoding), response.status));
				})
				.catch((error: any) =>
				{
					if (error.response)
					{
						reject(new HTTPResponse(HTTPResponseType.BAD_CODE, undefined, error.response.status));
					}
					else if (error.request)
					{
						reject(new HTTPResponse(HTTPResponseType.NO_RESPONSE, error.request));
					}
					else
					{
						reject(new HTTPResponse(HTTPResponseType.FAILED, error.message));
					}
				});
		});
	}
}
