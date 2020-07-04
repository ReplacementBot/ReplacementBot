import axios, { AxiosResponse } from 'axios';
import iconov from 'iconv-lite';
import RootPath from 'app-root-path';
import fs from 'fs';

export enum WebFetcherResponseType
{
	SUCCESSFUL,
	BAD_CODE,
	NO_RESPONSE,
	FAILED,
}

export class WebFetcherResponse
{
	type: WebFetcherResponseType;
	result: string;
	statusCode: number;
	constructor(type: WebFetcherResponseType, result?: string, statusCode?: number)
	{
		this.type = type;
		this.result = result;
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
		case WebFetcherResponseType.SUCCESSFUL:
			return 'Request Successfully';
		case WebFetcherResponseType.BAD_CODE:
			return `Server returned bad code (${this.statusCode})`;
		case WebFetcherResponseType.NO_RESPONSE:
			return 'Server didn\'t send any response';
		case WebFetcherResponseType.FAILED:
			return `Failed to send request (${this.result})`;
		}
	}
}

export default class WebFetcher
{
	public request(url: string, encoding = 'UTF-8'): Promise<WebFetcherResponse>
	{
		if(url.startsWith('testData:///'))
		{
			const file = url.replace('testData:///', RootPath.path + '/tests/resources/webFetcher/');
			if(fs.existsSync(file))
			{
				const data = fs.readFileSync(file).toString();
				return Promise.resolve(new WebFetcherResponse(WebFetcherResponseType.SUCCESSFUL, data, 200));
			}
			else
			{
				return Promise.reject(new WebFetcherResponse(WebFetcherResponseType.BAD_CODE, undefined, 404));
			}

		}
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
						reject(new WebFetcherResponse(WebFetcherResponseType.FAILED, `WebFetcher Error: "${encoding}" encoding don't exist`));
					}
					resolve(new WebFetcherResponse(WebFetcherResponseType.SUCCESSFUL, iconov.decode(response.data, encoding), response.status));
				})
				.catch((error: any) =>
				{
					if (error.response)
					{
						reject(new WebFetcherResponse(WebFetcherResponseType.BAD_CODE, undefined, error.response.status));
					}
					else if (error.request)
					{
						reject(new WebFetcherResponse(WebFetcherResponseType.NO_RESPONSE, error.request));
					}
					else
					{
						reject(new WebFetcherResponse(WebFetcherResponseType.FAILED, error.message));
					}
				});
		});
	}
}
