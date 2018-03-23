[![NPM](https://nodei.co/npm/beloader.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/beloader)

[![GitHub release](https://img.shields.io/github/release/liqueurdetoile/beloader.svg)](https://github.com/liqueurdetoile/beloader)
[![Build Status](https://travis-ci.org/liqueurdetoile/beloader.svg?branch=master)](https://travis-ci.org/liqueurdetoile/beloader)
[![Coverage Status](https://coveralls.io/repos/github/liqueurdetoile/beloader/badge.svg?branch=master)](https://coveralls.io/github/liqueurdetoile/beloader?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Documentation](https://liqueurdetoile.github.io/beloader/badge.svg)](https://liqueurdetoile.github.io/beloader/)

[![bitHound Overall Score](https://www.bithound.io/github/liqueurdetoile/beloader/badges/score.svg)](https://www.bithound.io/github/liqueurdetoile/beloader)
[![bitHound Code](https://www.bithound.io/github/liqueurdetoile/beloader/badges/code.svg)](https://www.bithound.io/github/liqueurdetoile/beloader)
[![bitHound Dependencies](https://www.bithound.io/github/liqueurdetoile/beloader/badges/dependencies.svg)](https://www.bithound.io/github/liqueurdetoile/beloader/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/liqueurdetoile/beloader/badges/devDependencies.svg)](https://www.bithound.io/github/liqueurdetoile/beloader/master/dependencies/npm)
[![Known Vulnerabilities](https://snyk.io/test/github/liqueurdetoile/beloader/badge.svg?targetFile=package.json)](https://snyk.io/test/github/liqueurdetoile/beloader?targetFile=package.json)

<p align="center"><a href="https://liqueurdetoile.com" target="\_blank"><img src="https://hosting.liqueurdetoile.com/logo_lqdt.png" alt="Liqueur de Toile"></a></p>

# Beloader
Beloader is a lightweight asset loader library. It provides simple means to trigger and monitor download of any asset (css, script, font...).

Its fine-grained event management and simple interface for plugins let anyone extends it with ease to own needs.

It particularly shines as a front-end loader because it can manage all kinds of assets and not only scripts or stylesheets.

## Why Beloader ?
- ultra-lightweight (24 KB minified, 7/8 KB minified and gzipped) 
- No more dealing with race loading in a web page or app
- Highly customizable loaders, callbacks and pluglins

## Features
- Can load assets asynchronously (except binary data if base64 format not available)
- Promise based : Each asset loading (item) exposes a promise interface that is resolved when asset ready or rejected in case of error
- Defer mode : each asset promise will be resolved exactly in the same order that they have been requested
- Awaiting mode : an asset promise will be resolved only when its declared dependencies are resolved
- Event based : You can hook callbacks at each loading step
- Plugin friendly : Beloader architecture makes adding plugins a breeze

## Installation, how-to and API reference
You can access [Beloader manual](https://liqueurdetoile.github.io/beloader/manual/index.html) or [API reference](https://liqueurdetoile.github.io/beloader/identifiers.html)

## Bugs and features requests
Beloader is test-driven though it did not prevent all issues. Please report [here](https://github.com/liqueurdetoile/beloader/issues) any trouble or features request.

## Want to help ?
There is many more to do, implements specific loaders or create plugins. Don't mind to fork Beloader, tweak it and submit a pull request :wink:

