---
title: '21 days of Abundance Telegram bot'
stack: 'NodeJS, Firebase, Heroku, Telegram Bot API'
---

A simple bot providing guidance in form of daily tasks and audio files for people performing recently popular in the Interwebs course of medidation called '21 days of abundance'. 
On recieving a message from new telegram account, bot creates a record in Firebase realtime database and sends out the general guidelines for the course. On recieving confirmation that daily task has been completed, bot sends out next day's task coupled with the audio containing a short lecture on spirituality and medidation mentoring. 

Bot written in NodeJS with node-telegram-bot-api library, and hosted on Heroku. 

Bot is available in Telegram at @WholyBot.  

So far bot does not track intervals between sending out tasks and does not have end-point logic or content. Also content is to be edited to be more suitable for bot. Original content comes from WhatsApp group I have been invited some months ago. And there comes my idea of the bot as well. This is something that might be automated. 

## Topics

1. NodeJS
2. API
3. Heroku
4. Bot