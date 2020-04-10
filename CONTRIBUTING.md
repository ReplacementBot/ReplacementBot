# Contributing 👥 

We greatly appreciate any work contributed, no matter how small! Pull Requests and Issues or Feature Requests are welcome. If you aren't sure about your change, please first discuss the change you wish to make via issue.

## Pull Request Process

1. Follow the [SETUP.MD](SETUP.MD) to run your own fork and local instancie of the bot.
2. Make any changes that you want
3. If you can, write tests for changed that you made to don't lower coverage.
4. Check if test pass locally and, check run ESLint [tests/README.md](tests/README.md)
5. Create a Pull Request
6. CircleCi will automatically check your PR . CI will run build, testing, and linting tests.
7. Wait for maintainer to review your PR.

## Running Tests and Lint ✅
You can run tests by running `npm test`. And code style checking by `npm lint`. Make sure that both check passes locally before making PR

ReplacementBot uses [Jest](https://jestjs.io) for Testing and, [CircleCi](https://circleci.com) for Cloud Testing.