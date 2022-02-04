// packages
const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

const log = new CatLoggr();

// constants
const generated = new Set();

module.exports = {
	name: 'gen', // command name at execute (may be different from the file name)
	description: 'Generate a specified service, if stocked.', // description in help command

    // the command :D
	execute(message, args) {
        // if the gen channel is not specified in config or bad id specified
        try {
            message.client.channels.cache.get(config.genChannel).id; // get the gen channel id (for testing the config)
        } catch (error) {
            if (error) log.error(error);
            if (config.command.error_message === true) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Error occured!')
                    .setDescription('Not a valid gen channel specified!')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );
            };
        };

        // if command executed in the gen channel
        if (message.channel.id === config.genChannel) {
            // if the command used before the cooldown ends
            if (generated.has(message.author.id)) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor(color.red)
                    .setTitle('Cooldown')
                    .setDescription('Please wait before executing that command again!')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );
            } else {
                const service = args[0];

                // if no service specified
                if (!service) {
                    return message.channel.send(
                        new Discord.MessageEmbed()
                        .setColor(config.color.red)
                        .setTitle('Missing parameters!')
                        .setDescription('You need to specify a service!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setTimestamp()
                    );
                };
                
                const filePath = `${__dirname}/../stock/${args[0]}.txt`; // path for the specified service

                // read file
                fs.readFile(filePath, function (error, data) {
                    // if everything is okay c:
                    if (!error) {
                        data = data.toString(); // convert content to strings

                        const position = data.toString().indexOf('\n'); // get position
                        const firstLine = data.split('\n')[0]; // get the first line

                        // if nothing in the specified service file
                        if (position === -1) {
                            return message.channel.send(
                                new Discord.MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Gen error!')
                                .setDescription(`I do not find the \`${args[0]}\` service in my stock!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );
                        };

                        // send the embed and the copy+pasta message to user
                        message.author.send(
                            new Discord.MessageEmbed()
                            .setColor(config.color.green)
                            .setTitle('Generated account')
                            .addField('Service', `\`\`\`${args[0][0].toUpperCase()}${args[0].slice(1).toLowerCase()}\`\`\``, true)
                            .addField('Account', `\`\`\`${firstLine}\`\`\``, true)
                            .setTimestamp()
                        ).then(message.author.send('Here is your copy+paste:')).then(message.author.send(`\`${firstLine}\``));

                        // if the DM message sent successfully
                        if (position !== -1) {
                            data = data.substr(position + 1); // remove line
                            
                            // write the changes to service file
                            fs.writeFile(filePath, data, function (error) {
                                message.channel.send(
                                    new Discord.MessageEmbed()
                                    .setColor(config.color.green)
                                    .setTitle('Account generated seccessfully!')
                                    .setDescription(`Check your private ${message.author}! *If you do not recieved the message, please unlock your private!*`)
                                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                    .setTimestamp()
                                );

                                generated.add(message.author.id); // create cooldown for the author

                                // set cooldown
                                setTimeout(() => {
                                    generated.delete(message.author.id); // remove the author after the cooldown expires
                                }, config.genCooldown); // get cooldown from config

                                // if an error occured
                                if (error) log.error(error); // say to console
                            });
                        } else {
                            return message.channel.send(
                                new Discord.MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Generator error!')
                                .setDescription(`The \`${args[0]}\` service is empty!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );
                        };
                    } else {
                        return message.channel.send(
                            new Discord.MessageEmbed()
                            .setColor(config.color.red)
                            .setTitle('Generator error!')
                            .setDescription(`Service \`${args[0]}\` does not exist!`)
                            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                            .setTimestamp()
                        );
                    };
                });
            };
        } else {
            message.channel.send(
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Wrong command usage!')
                .setDescription(`You cannot use the \`gen\` command in this channel! Only in <#${config.genChannel}>A`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	}
};