# Discord GEN-BOT

## Badges
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/blazsmaster/discord-gen-bot?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/blazsmaster/discord-gen-bot?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/blazsmaster/discord-gen-bot?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/blazsmaster/discord-gen-bot?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/blazsmaster/discord-gen-bot?style=for-the-badge)


## Table of Contents
- [Installion](#installion)
- [How it Works?](#works?)
- [Upcoming Updates](#upcoming)

## Installion
Install packages: `npm install`

### Configuration file
Before you try to start the bot, you need to fill the `config.json` file.
```json
{
    "token": "",
    "prefix": "",
    "genChannel": "",
    "genCooldown": "",
    "color": {
        "green": "0x43B581",
        "yellow": "0xFAA61A",
        "red": "0xF04747",
        "default": "0x7289DA"
    }
}
```
- `token`: Your bot's token
- `prefix`: Your prefix for executing commands (max 10 characters)
- `genChannel`: Target channel for `gen` command
- `genCooldown`: Time between two `gen` command *(use millisec)*

You can change the `green`, `yellow`, `red` and `default` colors.

---

### Stock location
The default stock location: 
```js
const filePath = `${__dirname}/../stock/${args[0]}.txt`;
                        ^^                  ^^
                  commands folder         service
```
If you want to change the stock location, for example 
```js
`${__dirname}/../files/stock/${args[0]}.txt`
```
You need to keep the `${__dirname}/../` commands folder location.

---

## How it works?

### Adding account/data
Add an account or data with `add` command. The space character in the data parameter make the write wrong.
- Example: `add example_service abcd`
Wrong example: `add example_service abcd` ~~`efg hijk`~~ <-- the last 2 arguments are not stored.

![img](https://media.discordapp.net/attachments/823618296272257024/823618331881504798/unknown.png)

---

### Account/data generating
You can add account to the bot using `gen` command.
- Example: `gen example_service`

- Server:

![img](https://media.discordapp.net/attachments/823618296272257024/823618340198940812/unknown.png)

- DM:

![img](https://media.discordapp.net/attachments/823618296272257024/823618347966005349/unknown.png)

---

### Creating service
Create a service with `create` command.
- Example: `create example_service`

![img](https://media.discordapp.net/attachments/823618296272257024/823618323047907358/unknown.png)

### Check service stock
Check a definied service's account size.
- Example: `check test`

![img](https://media.discordapp.net/attachments/823618296272257024/824189319211384853/unknown.png)

---

## Upcoming

- ✔️ *~~`stock`~~ `check` - Check how many items in a service file (how many lines in)*
- `restock` - Restock all services
