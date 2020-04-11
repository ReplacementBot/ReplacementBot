# 🚀 Running Locally

## 🍱 Prepare Discord

To run an instance of any of Discord Bots you must create the app on [Discord Developer Portal](https://discordapp.com/developers/applications) first.<br>
There is a detailed guild which guides you through the process: [Creating a Bot Account](https://discordpy.readthedocs.io/en/latest/discord.html). Be sure to copy Token from step 7, you will need it!

## ⚡️ Setup Bot

### Install Required Software:
- [GIT](https://git-scm.com) (GUI such [GitHub Desktop](https://desktop.github.com) can be helpful)
- [Node.JS](https://nodejs.org)

### Clone The Repository

To clone the repository, either use the Git GUI if you have one installed or enter the following commands:
```sh
# if you don't want to contribute
git clone https://github.com/MrBartusek/ReplacementBot.git
cd ReplacementBot
```
If you want to contribute, first [fork the original repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and clone the **forked** repository into your local machine. If you don't do this, you will not be able to make commits or change any files.
```sh
# if you won't want to contribute
git clone https://github.com/<username>/ReplacementBot.git
cd ReplacementBot
```
Read more about contributing in [CONTRIBUTING.md](CONTRIBUTING.md)

### Install Dependencies And Build Project

That step will setup files on your local machine that are not copied from the repository.
```sh
npm install
npm run build
```

## 🔧 Configure Bot

🔧Read about bot configuration at [wiki](https://github.com/MrBartusek/ReplacementBot/wiki/🔧-Configure-Bot) **(required)**

🍱 Configure replacements channel [wiki](https://github.com/MrBartusek/ReplacementBot/wiki/🍱-Setup-Replacements-Channel) **(optional)**

## 🚀 Launch!

To run the bot type:
```
npm start
```

Enjoy! Be sure to report any issues or feature request on [issue page](https://github.com/MrBartusek/ReplacementBot/issues)
