# ReplacementBot - School Replacement Discord Bot
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg" />
  <a href="https://github.com/MrBartusek/ReplacementBot/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/MrBartusek/ReplacementBot/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/MrBartusek/replacement-bot" />
  </a>
</p>

Simple Discord bot using [Discord.js](https://github.com/discordjs/discord.js) for fetching school replacements generated via Vulcan's Software

## My Goal - Make Life Easier
My school replacements site is inconvenient. You need to search in a huge list of all replacement for your class. So, I created this bot to make replacements checking easier for me and my colleagues.
Cause that we don't need to check replacement for every in a while cause bot will send us notification when anything changes.

## Features
- Fetching replacement for provided day `tt!fetch 2019 01 01`
- Getting Embed with a replacement for the next couple of days `tt!embed`
- Updating embed on specified channel `tt!update` *or automatic every 30 mins*
- Highly Configurable

![Presentation Image](https://i.imgur.com/VkOw4BI.png)

## Running Locally
Make sure you have [Node.js](https://nodejs.org/en/download) installed.

```sh
$ git clone https://github.com/MrBartusek/ReplacementBot.git # or clone your own fork
$ cd ReplacementBot
$ npm install
$ npm start
```

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/MrBartusek/ReplacementBot/issues).

## License

Copyright © 2019 [MrBartusek](https://github.com/MrBartusek)<br />
This project is [MIT](https://github.com/MrBartusek/ReplacementBot/blob/master/LICENSE) licensed
