const fs = require('fs');
const appRoot = require('app-root-path');
import Logger from "./logger"
import ConfigValidator from "../util/configValidator";
import { CommandoClient } from "discord.js-commando";

const DEFAULT_CONFIG_PATH = "config/default.json";

export enum ConfigSources { AUTO, FILE, ENVIRONMENT }

export class Config
{
	data: object;
	validator: ConfigValidator;
	constructor(settings: ConfigSettings)
	{
		switch (settings.source) {
			case ConfigSources.ENVIRONMENT:
				this.ENVIRONMENT_Setup();
				break;
			case ConfigSources.FILE:
				this.FILE_Setup(settings.args);
				break;
			default:
				Logger.fatalAndCrash(`Config setup function for source: "${settings.source}" is not implemented`)
				break;
		}
	}
		
	private FILE_Setup(path: string)
	{
		const content = fs.readFileSync(appRoot + '/' + path);
		const json = JSON.parse(content);
		this.data = json;
	}
	private ENVIRONMENT_Setup()
	{
		this.data = JSON.parse(process.env.REPLACEMENT_BOT_CONFIG);
	}

	public loadToGlobal()
	{
		if((global as any).config == undefined)
		{
			(global as any).config = this;
		}
		else
		{
			Logger.fatalAndCrash("Failed to load Configuration to Global Scope cause some Configuration is already loaded to it")
		}
	}
	public contains(key: string)
	{
		if(this.data == undefined)
		{
			return undefined;
		}
		else
		{
			return Object.prototype.hasOwnProperty.call(this.data, key);
		}
	}
	public get(key: string)
	{
		if(this.data == undefined)
		{
			return undefined;
		}
		else if(this.contains(key))
		{
			return (this.data as IIndexable)[key] as any;
		}
		else
		{
			return undefined;
		}
	}
	public async validate(client : CommandoClient)
	{
		await new ConfigValidator(client, this).validate();
	}
}

export class ConfigSettings
{
	source: ConfigSources;
	args: any;
	constructor(source: ConfigSources, args?: any)
	{
		if(source == ConfigSources.AUTO)
		{
			this.detectConfigSource()
		}
		else
		{
			this.source = source;
			this.args = args;
		}
	}
	private detectConfigSource()
	{
		if(fs.existsSync(DEFAULT_CONFIG_PATH))
		{
			this.source = ConfigSources.FILE;
			this.args = DEFAULT_CONFIG_PATH;
		}
		else if(process.env.REPLACEMENT_BOT_CONFIG)
		{
			this.source = ConfigSources.ENVIRONMENT;
			this.args = null;
		}
		else
		{
			Logger.fatalAndCrash("Config source has been set to AUTO, but it failed to detect automatically")
		}	
	}
}

interface IIndexable {
	[key: string]: any;
}