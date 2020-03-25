# ReplacementBot 📅
![CircleCI Master](https://img.shields.io/circleci/build/github/MrBartusek/ReplacementBot?label=master&logo=circleci&token=6bae64ae7a523f3f207804bf7818dc1d56f420a4)
[![codecov](https://codecov.io/gh/MrBartusek/ReplacementBot/branch/master/graph/badge.svg?token=ONXF6BONI4)](https://codecov.io/gh/MrBartusek/ReplacementBot)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=MrBartusek/ReplacementBot&identifier=222265419)](https://dependabot.com)

![Presentation Image](https://i.imgur.com/SR7pGcu.png)

ReplacementBot is a Discord bot made to make your life easier. The Bot automatically fetches replacement from your school website and shows them right on your discord server!

## ✨ Feature Rich

### ⌚️ Keep up with your replacement

ReplacementBot by the default, constantly updates one of the channels from your guild with freshest replacements. Forget about spamming with commands!

### 💻 Setup Custom Source

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
## 🚀 Running Locally

_TODO_

## 👥 Contributing

We greatly appreciate any work contributed, no matter how small!  Contributions, issues and feature requests are welcome!

Read more about contributing in [CONTRIBUTING.md](https://github.com/MrBartusek/ReplacementBot/blob/master/CONTRIBUTING.md)
