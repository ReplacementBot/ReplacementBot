import ReplacementBot from "./replacementBot";
import { ConfigSettings, ConfigSources } from "./managers/config";

const configSettings = new ConfigSettings(ConfigSources.AUTO);
new ReplacementBot(configSettings).start();