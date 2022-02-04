// packages
const Discord = require('discord.js');
const fs = require('fs');
const os = require('os');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

const log = new CatLoggr();

module.exports = {
	name: 'add', // command name at execute (may be different from the file name)
	description: 'Add an account to a specified service.', // description in help command

    // the command :D
	execute(message, args) {
        // constants (parameters)
        const service = args[0];
        const account = args[1];

        // if no service parameter specified in the command
        if (!service) {
            return message.channel.send(
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing parameters!')
                .setDescription('You need to specify a service!')
                .addField('For example', `${config.prefix}${this.name} **tree** apple`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
            // YOU ARE NEED THE RETURN STATEMENT TO STOP THIS FUNCTION (if you remove the "return", all of the functions below will be executed and breaks the command)
        };

        // if no account parameter specified in the command
        if (!account) {
            return message.channel.send(
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing parameters!')
                .setDescription('You need to specify an account!')
                .addField('For example', `${config.prefix}${this.name} tree **apple**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );            
        };

        const filePath = `${__dirname}/../stock/${args[0]}.txt`; // filepath to the service file

        // append data to file
        fs.appendFile(filePath, `${os.EOL}${args[1]}`, function (error) {
            if (error) return log.error(error); // if an error occured say to console the error

            message.channel.send(
                new Discord.MessageEmbed()
                .setColor(config.color.green)
                .setTitle('Account added!')
                .setDescription(`Successfuly added \`${args[1]}\` account to \`${args[0]}\` service!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            ).then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
        });
    }
};