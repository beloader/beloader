[![NPM](https://nodei.co/npm/beloader.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/beloader)

[![GitHub release](https://img.shields.io/github/release/beloader/beloader.svg)](https://github.com/beloader/beloader)
[![Gzip size](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/beloader@latest?compression=gzip&style=flat-square)](https://cdn.jsdelivr.net/npm/beloader@latest)
[![Build Status](https://travis-ci.org/beloader/beloader.svg?branch=master)](https://travis-ci.org/beloader/beloader)
[![Coverage Status](https://coveralls.io/repos/github/beloader/beloader/badge.svg?branch=master)](https://coveralls.io/github/beloader/beloader?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Documentation](https://beloader.github.io/beloader/badge.svg)](https://beloader.github.io/beloader/)

[![bitHound Overall Score](https://www.bithound.io/github/beloader/beloader/badges/score.svg)](https://www.bithound.io/github/beloader/beloader)
[![bitHound Code](https://www.bithound.io/github/beloader/beloader/badges/code.svg)](https://www.bithound.io/github/beloader/beloader)
[![bitHound Dependencies](https://www.bithound.io/github/beloader/beloader/badges/dependencies.svg)](https://www.bithound.io/github/beloader/beloader/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/beloader/beloader/badges/devDependencies.svg)](https://www.bithound.io/github/beloader/beloader/master/dependencies/npm)
[![Known Vulnerabilities](https://snyk.io/test/github/beloader/beloader/badge.svg?targetFile=package.json)](https://snyk.io/test/github/beloader/beloader?targetFile=package.json)

<p align="center"><a href="https://liqueurdetoile.com" target="\_blank"><img src="https://hosting.liqueurdetoile.com/logo_lqdt.png" alt="Liqueur de Toile"></a></p>

# Beloader
Beloader is a lightweight asset loader library. It provides simple means to trigger and monitor download of any asset (css, script, font...).

Its fine-grained event management and simple interface for plugins let anyone extends it with ease to own needs.

It particularly shines as a front-end loader cause it can manage all kinds of assets and not only scripts.

## Why Beloader ?
- Lightweight
- No more dealing with racing bets when loading in a web page or app
- Highly customizable dynamically imported loaders, callbacks and plugins

## Features
- Can load assets asynchronously (except raw binary data)
- Defer mode : each asset promise will be resolved exactly in the same order that they have been requested
- Awaiting mode : an asset promise will be resolved only when its declared dependencies are resolved
- Promise based : Each asset loading (item) exposes a promise interface that is resolved when asset ready or rejected in case of error
- Event based : You can hook custom callbacks at each step trigerred by specific events or create customs ones
- Plugin friendly : Beloader architecture makes adding plugins a breeze

## Installation, how-to and API reference
You can read [Beloader manual](https://liqueurdetoile.github.io/beloader/manual/index.html) or [API reference](https://liqueurdetoile.github.io/beloader/identifiers.html)

## Bugs and features requests
Beloader is test-driven though it did not prevent all issues. Please report [here](https://github.com/liqueurdetoile/beloader/issues) any trouble or features request.

## Want to help ?
There is many more to do, implements specific loaders or create plugins. Don't mind to fork Beloader, tweak it and submit a pull request :wink:

## Todo
- [ ] Add an HTML loader
- [ ] Add an audio loader (or plugin because renderer ?)
- [ ] Add a video loader (or plugin because renderer ?)
- [ ] Create a bundler engine to build a custom unique script file with choosen loaders and plugins
- [ ] Create advanced demos
- [ ] Create more plugins :wink:
- [ ] Create tests to improve coverage
