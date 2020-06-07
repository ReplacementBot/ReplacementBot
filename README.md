# ReplacementBot 📅
[![CircleCI Build](https://img.shields.io/circleci/build/github/MrBartusek/ReplacementBot?logo=circleci&token=6bae64ae7a523f3f207804bf7818dc1d56f420a4)](https://circleci.com/gh/MrBartusek/ReplacementBot)
[![Coverage](https://img.shields.io/codecov/c/github/MrBartusek/ReplacementBot?logo=codecov&logoColor=white)](https://codecov.io/gh/MrBartusek/ReplacementBot)
![OSS Lifecycle](https://img.shields.io/osslifecycle/MrBartusek/ReplacementBot)
[![Gitpod Ready](https://img.shields.io/badge/Gitpod-ready-blue?logo=gitpod&logoColor=white)](https://gitpod.io/#https://github.com/MrBartusek/ReplacementBot)
[![Dependabot Status](https://img.shields.io/badge/dependabot-enabled-blue?logo=dependabot)](https://dependabot.com)
![Version](https://img.shields.io/badge/version-beta-sucess)

🌱 **Beta Phase** - bot is working but, expect problems bugs and breaking changes

ReplacementBot is a Discord bot made to make your life easier. The Bot automatically fetches replacement from your school website and shows them right on your discord server!

---

![Presentation Image](https://i.imgur.com/SR7pGcu.png)

## ✨ Feature Rich

### ⌚️ Keep up with your replacement

ReplacementBot by the default, constantly updates one of the channels from your guild with freshest replacements. Forget about spamming with commands!

### 📕 Setup Custom Source

ReplacementBot is build to support custom data sources or, as we call it, `fetchers`. Creating your very own fetcher is easy. Here, look at that fetcher:
```ts
export default class MyOwnFetcher implements ReplacementsFetcher
{
  public fetchReplacements(date: moment.Moment): Promise<ReplacementDay>
  {
    // Any of your fetching action here
    return Promise.resolve(result)
  }
}
```
Put that file in `src\fetchers` and we handle other things by ourselves

---

## 💻 Public Instance

Unfortunately, Currently Public Instance isn't available 😞 Check Out: [Public Instance Milestone](https://github.com/MrBartusek/ReplacementBot/milestone/3)

## 🚀 Running Locally

Check [wiki](https://github.com/MrBartusek/ReplacementBot/wiki/⚡️-How-to-Setup-Bot) for detailed setup instructions!

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/MrBartusek/ReplacementBot) [![Heroku Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## 👥 Contributing

We greatly appreciate any work contributed, no matter how small!  Contributions, issues and feature requests are welcome ❤️ Read more about contributing in [wiki](https://github.com/MrBartusek/ReplacementBot/wiki/👥-How-to-Contribute)
