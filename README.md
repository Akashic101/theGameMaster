# theGameMaster

[![GitHub issues](https://img.shields.io/github/issues/Akashic101/theGameMaster)](https://github.com/Akashic101/theGameMaster/issues)  
[![GitHub license](https://img.shields.io/github/license/Akashic101/theGameMaster)](https://github.com/Akashic101/theGameMaster/blob/master/LICENSE)  
![GitHub package.json version](https://img.shields.io/github/package-json/v/Akashic101/theGameMaster)  
![GitHub repo size](https://img.shields.io/github/repo-size/Akashic101/theGameMaster?color=blueviolet)  
![GitHub last commit](https://img.shields.io/github/last-commit/Akashic101/theGameMaster)  

A Discord-bot for [Project Cars 2](https://www.projectcarsgame.com/two/) and [PirateLaserBeam](https://www.twitch.tv/piratelaserbeam) using Node-JS

## Table of Content

* [Features](#features)
* [How to install](#how-to-install)
* [TO DO](#to-do)

## Features

The main feature of the bot is the hot-lap-challenge. This challenge consists of one car and one track which will be driven for a week to get the highest position on the leaderbord in Time-Trial (TT). Other features include the ability to decide a random race with a random car/track.

Current commands are:

* `.HLCinfo` Send info about the current Hot-Lap-Challenge
* `.updateHLC` Updates the Hot-Lap-Challenge
* `.time` Gets every time in the top 25 of every driver who is in the [FS]-Racing-Team
* `.top X` Gets the top X time of the leaderboard. The limit is 25 since embedMessages on Discord can only have 25 fields
* `.randomRace` Returns a random track with a random car to race on
* `.randomTrack` Returns a random track
* `.randomCar` Returns a random car

## How to install

First you need to download [Node.js](https://nodejs.org/en/) and install it. After that go into the directory you want to install theGameMaster in and enter  
`git clone https://github.com/Akashic101/theGameMaster.git`

After that, go into the directory and use  
`npm install`  
to install all necessary dependencies and modules the bot uses.

When that is finished, use  
`npm ./createDatabases.js` to create and fill the databases with the needed information about every track and car in Project Cars 2.
___

### IMPORTANT

Right now there exists a bug which creates the database and does not fill it with the needed information. This can be fixed by simply running `npm ./createDatabases.js` again
___

After that, create a file called `.env` in the root-directory of the bot. In there write
`DISCORD_TOKEN = 'Your token here'`
`HLC_LINK=_'link here'`
`CAR=''`
`TRACK=''`

You can get the token by creating your own Discord-Application [here](https://discord.com/developers/applications). There simply go to the "Bot"-tab on the left side, click on "Click to Reveal Token" and copy the text. You can get the HLC_Link from <http://cars2-stats-steam.wmdportal.com/>

When that is done, launch the bot with  
`node .` or `node index.js`

If you want to automatically keep the bot alive forever you can use [pm2](https://pm2.keymetrics.io/). After you installed it, run  
`pm2 index.js --name theGameMaster --watch`

With this command, the bot is daemoninzed and will automatically restart incase it crashes or recieves an update. You can monitor it with `pm2 status` or `pm2 monit` for a more in-depth breakdown

## TO DO

Right now no new features need to be added
