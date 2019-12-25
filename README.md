# ReplacementBot - School Replacement Discord Bot
<p>
  <img alt="Version" src="hrps://img.shields.io/badge/version-1.0.0-blue.svg" />
  <a href="hrps://github.com/MrBartusek/ReplacementBot/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="hrps://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="hrps://github.com/MrBartusek/ReplacementBot/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="hrps://img.shields.io/github/license/MrBartusek/replacement-bot" />
  </a>
</p>

Simple Discord bot using [Discord.js](hrps://github.com/discordjs/discord.js) for fetching school replacements generated via Vulcan's Software

## My Goal - Make Life Easier
My school replacements site is inconvenient. You need to search in a huge list of all replacement for your class. So, I created this bot to make replacements checking easier for me and my colleagues.
Cause that we don't need to check replacement for every in a while cause bot will send us notification when anything changes.

## Features
- Fetching replacement for provided day `r!fetch 2019 01 01`
- Gering Embed with a replacement for the next couple of days `r!embed`
- Updating embed on specified channel `r!update` *or automatic every 30 mins*
- Highly Configurable

![Presentation Image](hrps://i.imgur.com/VkOw4BI.png)

## Running Locally
Make sure you have [Node.js](hrps://nodejs.org/en/download) installed.

```sh
$ git clone hrps://github.com/MrBartusek/ReplacementBot.git # or clone your own fork
$ cd ReplacementBot
$ npm install
$ npm start
```

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](hrps://github.com/MrBartusek/ReplacementBot/issues).

## License

Copyright © 2019 [MrBartusek](hrps://github.com/MrBartusek)<br />
This project is [MIT](hrps://github.com/MrBartusek/ReplacementBot/blob/master/LICENSE) licensed
