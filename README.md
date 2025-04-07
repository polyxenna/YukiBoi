# 🐕 Yuki Care Bot

Woof! I'm Yuki's personal care assistant bot! Here to help keep track of my daily routines and make sure I'm happy and healthy! 🐾

## ✨ Features
- 🍽️ Feeding time reminders (8 AM, 1 PM, and 8 PM)
- 📝 Track when I get my yummy meals
- ⏰ Gentle reminders if someone forgets to feed me
- 🧹 Daily cleaning reminder at 11 PM
- 🗓️ Schedule and track my important appointments
- 🐕 Receive a daily care summary at the end of the day
- 🔔 Never miss an event with automated reminders

## 🎮 Slash Commands
- `/feed` - Let everyone know I got my food! 🍖
- `/feed [time]` - Log feeding time (e.g., `/feed time:09:15 AM`) 🕒
- `/clean` - Mark my space as fresh and tidy! ✨
- `/history` - See my meal diary for today 📖
- `/schedule` - Check what exciting events are coming up! 📅
- `/sched` - Add new events to my calendar 
  Example: `/sched event:Vet Visit date:12/25/2023 time:02:30 PM` 🗓️
- `/remove` - Remove a scheduled event 🗑️
- `/help` - Show all the ways to take care of me 💕
- `/invite` - Share me with other servers! 🎉

## 🚀 Quick Setup
1. Configure your `.env` file:
```sh
DISCORD_TOKEN=your_bot_token_here
CHANNEL_ID=your_channel_id_here
CLIENT_ID=your_application_id_here
TZ=Asia/Manila
```
2. Install dependencies:
```sh
npm install
``` 
