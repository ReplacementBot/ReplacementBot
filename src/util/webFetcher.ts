import axios, { AxiosResponse } from 'axios';
import http from 'http';
import iconov from 'iconv-lite';
import Logger from '../managers/logger';

export class HTTPResponse
{
	type: HTTPResponseType;
	details: string;
	statusCode: number;
	constructor(type: HTTPResponseType, details?: string, statusCode?: number)
	{
		this.type = type;
		this.details = details;
		this.statusCode = statusCode;
		if(statusCode === undefined)
		{
			statusCode = 0;
		}
	}
}

export enum HTTPResponseType
{
	SUCCESSFULLY,
	BAD_CODE,
	NO_RESPONSE,
	FAILED,
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
					timeout: 5000,
				})
				.then((response: AxiosResponse<Buffer>) =>
				{
					if(!iconov.encodingExists(encoding))
					{
						reject(new HTTPResponse(HTTPResponseType.FAILED, `WebFetcher Error: "${encoding}" encoding don't exist`));
					}
					resolve(new HTTPResponse(HTTPResponseType.SUCCESSFULLY, iconov.decode(response.data, encoding), response.status));
				})
				.catch((error: any) =>
				{
					if (error.response)
					{
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						reject(new HTTPResponse(HTTPResponseType.BAD_CODE, undefined, error.response.status));
					}
					else if (error.request)
					{
						// The request was made but no response was received
						reject(new HTTPResponse(HTTPResponseType.NO_RESPONSE, error.request));
					}
					else
					{
						// Something happened in setting up the request that triggered an Error
						reject(new HTTPResponse(HTTPResponseType.FAILED, error.message));
					}
				});
		});
	}

}
