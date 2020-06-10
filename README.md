# 

[![GitHub issues](https://img.shields.io/github/issues/Akashic101/theGameMaster)](https://github.com/Akashic101/theGameMaster/issues)  [![GitHub license](https://img.shields.io/github/license/Akashic101/theGameMaster)](https://github.com/Akashic101/theGameMaster/blob/master/LICENSE) ![GitHub package.json version](https://img.shields.io/github/package-json/v/Akashic101/theGameMaster) ![GitHub repo size](https://img.shields.io/github/repo-size/Akashic101/theGameMaster?color=blueviolet)

A Discord-bot for [PirateLaserBeam](https://www.twitch.tv/PirateLaserBeam/) and [Full Send Racing](https://steamcommunity.com/groups/FullSendRacing)

## Table of Content

* [General Info](#general-info)
* [How to Install](#how-to-install)
* [Commands](#commands)
* [Auto launch](#auto-launch)
* [TO DO](#to-do)

## General Info

This bot was made for [PirateLaserBeam](https://www.twitch.tv/PirateLaserBeam/) and his racing-team [Full Send Racing](https://steamcommunity.com/groups/FullSendRacing). The main feature of the bot is to list every members time of the weekly hot-lap challenge

## Commands

The prefix for the commands is `!`. You can change that to your liking by edtiting the `PREFIX`-variable in Index.js

Right now all commands are:

* `time` (Lists every members time)
* `top <number>` (Lists the top X of the leaderboard

## Auto Launch

 If you want theGameMaster to automatically boot whenever your system is starting you can use [pm2](https://www.npmjs.com/package/pm2) for this. Simply install it with `npm install pm2`, but instead of launching theGameMaster with `node .` or `node index.js`, use `pm2 start index.js`. theGameMaster is now daemonized, monitored and kept alive forever. If you want to see how many resources theGameMaster is using, enter `pm2 list` or `pm2 monit` for more in-depth information
 
 ## TO DO
 
 * Add more general commands
 * Make getting list of racetrack + vehicle more dynamic
