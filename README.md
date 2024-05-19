# A Discord Bot to interact with [Crafty Controller](https://craftycontrol.com/)

So far all it does is start the server.

## How to use
It is assumed you have already made a bot and got its token. Also, you need to have made an API key for Crafty Controller, make sure the user that the key is based off has perms to the server.

1. Install Nodejs and import the repository, then run the command in the repository folder:
   ```bash
   npm install
   ```

2. Create a file called `.env`, this is where all the secret stuff is stored.
   Inside `.env` put you secret stuff in this format:
   ```env
   DISCORD_TOKEN=<token>
   CRAFTY_TOKEN=<token>
   CRAFTY_SERVER_URL=https://localhost:8000/api/v2/servers/<server-id> # This URL is assuming you host it on the local machine with the default port
   ```

3. Run the bot using command
   ```bash
   node src/bot.js
   ```

#### Commands
`>start` - Starts the server

## Other stuff
*I am learning JavaScript so if you find any errors or bad practice any help is appreciated.*

#### Future Features:
- Turn server off after period of time
- Turn server off with a command (configurable)
- Config file
- Statistics (players and stuff)
- *suggestions are welcome!*

#### LICENSE.
Read it! (pls read if you want to do anything with it!!) (License tab!!!!!!)
