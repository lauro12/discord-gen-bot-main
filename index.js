// packages
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const CatLoggr = require('cat-loggr');

const client = new Discord.Client();
const log = new CatLoggr();

client.commands = new Discord.Collection();

// logs
if (config.debug === true) client.on('debug', stream => log.debug(stream)); // if debug is enabled in config
client.on('warn', message => log.warn(message));
client.on('error', error => log.error(error));
client.on('rateLimit', message => log.warn(JSON.stringify(message, null, 2)));

// load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // command library
for (const file of commandFiles) {
	const command = require(`./commands/${file}`); // read commands
    log.init(`Loaded command ${file.split('.')[0] === command.name ? file.split('.')[0] : `${file.split('.')[0]} as ${command.name}`}`); // say to console
	client.commands.set(command.name, command); // set commands to use
};

// login with token
client.login(config.token);

// on login
client.once('ready', () => {
	log.info(`I am logged in as ${client.user.tag} to Discord!`); // say to console
    client.user.setActivity(`${config.prefix}help • ${client.user.username.toUpperCase()}`, { type: "LISTENING" }); // set discord bot activity
    /* you can change the activity type to:
     * LISTENING
     * WATCHING
     * COMPETING
     * STREAMING (you need to add a twitch.ty url next to type like this:   {type:"STREAMING", url:"https://twitch.tv/usernamehere"}   )
     * PLAYING (default)
    */
});

// message event // command handling
client.on('message', (message) => {
	if (!message.content.startsWith(config.prefix)) return; // if the message does not start with the prefix
	if (message.author.bot) return; // if a bot tries to execute the command (timed commands by other bots or bot client) (you can remove this line if you want)

	const args = message.content.slice(config.prefix.length).trim().split(/ +/); // split the messages to arguments
	const command = args.shift().toLowerCase();

    // if the command not found
	if (config.command.notfound_message === true && !client.commands.has(command)) {
        return message.channel.send(
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Unknown command :(')
            .setDescription(`Sorry, but I cannot find the \`${command}\` command!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
    };

    // execute the command (with error handling)
	try {
		client.commands.get(command).execute(message, args); // execute the command
	} catch (error) {
		log.error(error); // say to console the error

        // send message to channel if error message is enabled in config
		if (config.command.error_message === true) {
            message.channel.send(
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error occurred!')
                .setDescription(`An error occurred while executing the \`${command}\` command!`)
                .addField('Error', `\`\`\`js\n${error}\n\`\`\``)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	};
});
