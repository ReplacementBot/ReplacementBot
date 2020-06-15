## 🚀 Running Locally

To run an instance of any of Discord Bots you must first create the app on [Discord Developer Portal](https://discordapp.com/developers/applications) first. There is a detailed guild which guides you through the process: [Creating a Bot Account](https://discordpy.readthedocs.io/en/latest/discord.html).

## Heroku Hosting

You can easily setup bot to work 24/7 with heroku! Be sure to enter bot token when deploying, you can get it from the step above. After setup you need to disable `web` dyno and enable `woker` dyno from **Resources** tab or, your bot will [keep crashing](https://github.com/ReplacementBot/ReplacementBot/issues/60). This method require [ENV Configuration](https://replacementbot.github.io/docs/configuration.html#environmental-variable-env) if you want to use config. 

[![Heroku Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Simple Cloud Development

If you don't want to mess with setup on local machine you can work on bot in the cloud in one click! Gitpod will serve you pre-build workspace in couple of seconds! **Note**: Free version allow for **50 hours / month** if you would like to work more, consider [Upgrade](https://www.gitpod.io/pricing/) or [Manual Setup](#Manual-Setup)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ReplacementBot/ReplacementBot)

## Manual Setup

If you want to work on bot or host no local machine you can setup it with this guide

### Install Required Software:
- [GIT](https://git-scm.com) (GUI such [GitHub Desktop](https://desktop.github.com) can be helpful)
- [Node.JS](https://nodejs.org)

### Clone The Repository

To clone the repository, either use the Git GUI if you have one installed or enter the following commands:
```sh
# if you don't want to contribute
git clone https://github.com/ReplacementBot/ReplacementBot.git
cd ReplacementBot
```
If you want to contribute, first [fork the original repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and clone the **forked** repository into your local machine. If you don't do this, you will not be able to make commits or change any files.
```sh
# if you won't want to contribute
git clone https://github.com/<username>/ReplacementBot.git
cd ReplacementBot
```
Read more about contributing in [CONTRIBUTING.MD](CONTRIBUTING.md)

### Install Dependencies And Build Project

That step will setup files on your local machine that are not copied from the repository.
```sh
npm install
npm run build
```
