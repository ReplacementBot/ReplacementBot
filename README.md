# ReplacementBot 📅
[![CircleCI Build](https://img.shields.io/circleci/build/github/ReplacementBot/ReplacementBot?logo=circleci&token=6bae64ae7a523f3f207804bf7818dc1d56f420a4)](https://circleci.com/gh/ReplacementBot/ReplacementBot)
[![Coverage](https://img.shields.io/codecov/c/github/ReplacementBot/ReplacementBot?logo=codecov&logoColor=white)](https://codecov.io/gh/ReplacementBot/ReplacementBot)
![OSS Lifecycle](https://img.shields.io/osslifecycle/ReplacementBot/ReplacementBot)
[![Gitpod Ready](https://img.shields.io/badge/Gitpod-ready-blue?logo=gitpod&logoColor=white)](https://gitpod.io/#https://github.com/ReplacementBot/ReplacementBot)
![Version](https://img.shields.io/badge/version-beta-sucess)


Meet the **ReplacementBot**, a Discord bot made to make your school life easier. The Bot automatically fetches replacement from your school website and shows them right on your discord server. Automatically, every half an hour.

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

## 🚀 Running Locally

Check [SETUP.md](SETUP.md) for detailed setup instructions!

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ReplacementBot/ReplacementBot) [![Heroku Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## 👥 Contributing

We greatly appreciate any work contributed, no matter how small!  Contributions, issues and feature requests are welcome ❤️ Read more about contributing in [CONTRIBUTING.md](CONTRIBUTING.md)
