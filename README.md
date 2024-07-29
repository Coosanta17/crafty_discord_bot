# Crafty Controller Discord Bot.

> A Discord Bot to interact with and control [Crafty Controller](https://craftycontrol.com/) through commands in chat 

So far all it does is start *one* server.

### How to use
A basic knowledge of command line is assumed. 

The bot has been developed and tested in Node version `20.13.1`. Later versions should be fine, however unknown problems may happen.

1. Install NodeJs and import the repository, then run the command in the repository folder:
   ```bash
   npm install
   ```

2. Run the bot using command
   ```bash
   node .
   ```

### Configuration File
Here is the default configuration file, it will be located one directory up from `./src`.:
```json
{
    "bot": {
        "token": "BOT_TOKEN"
    },
    "crafty": {
        "api_token": "CRAFTY_TOKEN",
        "server_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "url": "https://localhost:8000/"
    },
    "commands": {
        "slash": {
            "enabled": true
        },
        "text": {
            "enabled": false,
            "prefix": "!"
        }
    },
    "auto_stop": {
        "enabled": true,
        "check_interval": 2,
        "empty_wait_time": 30
    },
    "stop_command": {
        "enabled": false,
    }
}
```


- `bot.token` - The discord bot's token. Learn how to get one [here](https://www.youtube.com/watch?v=GvK-ZigEV4Q)


- `crafty:`

    - `api_token` - The api token for [crafty controller user](https://docs.craftycontrol.com/pages/user-guide/user-role-config/#adding-a-role), make sure it has the COMMANDS permission and access to the server.

    - `server_id` - The [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier) of the server. You can find it in the link to the server near the end.

    - `url` - The url to access the controller


- `commmands:`

    - `slash.enabled` - Whether slash commands are enabled, recommended `true`

    - `text.enabled` and `text.prefix` - Whether text commands are enabled, for example, if prefix if set to `!`, help command would be `!help`

- `auto_stop:`

    - `enabled` - Whether the server will automatically stop.

    - `check_interval` - How often the bot will ping Crafty Controller in minutes, 2 minutes is usually alright, as too often may result in high network traffic, and too far apart may result in the server shutting down later than the wait time.

    - `empty_wait_time` - How long (in minutes) the server needs to be empty before shutting down.

- `stop command` - New Feature Coming soon!!


### Commands
`/start` - Starts the preconfigured server

### Other stuff
*I am still learning JavaScript so if you find any errors or bad practice any help is appreciated.*

#### Future Features:
- ~~Turn server off after period of time.~~ :white_check_mark:
- ~~Config file.~~ :white_check_mark:
- Turn server off with a command (configurable).
- Handling multiple servers.
- Channel binds for different servers.
- Statistics (players and stuff) *\*maybe?\**.
- *suggestions are welcome!*

#### LICENSE.
Check License tab.
