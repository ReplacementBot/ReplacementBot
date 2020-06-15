[![Beginner friendly issues](https://img.shields.io/github/issues/ReplacementBot/ReplacementBot/good%20first%20issue?color=blueviolet&label=beginner%20friendly%20issues&logo=github)](https://github.com/ReplacementBot/ReplacementBot/labels/good%20first%20issue) 
[![Open Issues](https://img.shields.io/github/issues/ReplacementBot/ReplacementBot?color=blueviolet&label=issues&logo=github)](https://github.com/ReplacementBot/ReplacementBot/issues)
[![Open PRs](https://img.shields.io/github/issues-pr/ReplacementBot/ReplacementBot?color=blueviolet&label=pull%20requests&logo=github)](https://github.com/ReplacementBot/ReplacementBot/pulls) 

<!-- There are couple of shields showing open prs issues etc. use markdown preview to view them-->

We greatly appreciate any work contributed, no matter how small! Pull Requests and Issues or Feature Requests are welcome 👍

If you are new to Open Source:  
- Check [this guide](https://help.github.com/en/github/getting-started-with-github) how to use Github
- If you don't want to mess with GIT command you can use [Github Desktop](https://desktop.github.com)
- Sometimes you can find issues labelled with `good first issue` which are prepared for newcomers like you!


## 🐞 Creating issues

If you find any bug or want something to be added to ReplacementBot please create an [issue](https://github.com/MrBartusek/ReplacementBot/issues). We are offering a couple of templates to chose from so read their descriptions to chose a good one!

## ↖️ Pull Request Process

1. Follow the [How To Setup Bot](https://github.com/MrBartusek/ReplacementBot/wiki/⚡️-How-to-Setup-Bot) to run your own fork and local instance of the bot.
2. Make any changes that you want
3. If you can, write tests for changes that you made to don't lower coverage. If you don't know how to write tests please use `test.todo()`
4. Check if Unit Test and Lint passed locally [Running Tests and Lint](#✅-Running-Tests-and-Lint)
5. Create a Pull Request
6. CircleCi will automatically check your PR. CI will run build, testing, and linting tests.
7. Wait for a maintainer to review your PR.

## ✅ Running Tests and Lint 
You can run tests by running `npm test`. And code style checking by `npm run lint`. Make sure that both checks passes locally before making PR

ReplacementBot uses [Jest](https://jestjs.io) for Testing and, [CircleCi](https://circleci.com) for Cloud Testing ☁️
