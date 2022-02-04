// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('../config.json');

// export command
module.exports = {
    
    // command name
	name: 'check',

    // command description
	description: 'Check a service.',

    // command
	execute(message) {

        // split message content
        const messageArray = message.content.split(' ');

        // args
        const args = messageArray.slice(1);

        // if no args[0] (service)
        if (!args[0]) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing parameters')
                .setDescription('You need to give a service name!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // stock files path
        const filePath = `${__dirname}/../stock/${args[0]}.txt`;

        // lines
        let lines = [];

        // file to read
        var fileContents;

        // try to read file
        try {

            // read file
            fileContents = fs.readFileSync(filePath, 'utf-8')

        // if error
        } catch (error) {

            // if error
            if (error) {
                
                // send message to channel
                message.channel.send(

                    // embed
                    new Discord.MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Check error!')
                    .setDescription(`I can not find the \`${args[0]}\` service in my stock!`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                // cancel
                return;
            };
        };

        // get lines
        fileContents.split(/\r?\n/).forEach(function (line) {

            // push lines
            lines.push(line);
        });

        // üzenet küldése csatornába
        message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.green)
            .setTitle(`Service checked!`)
            .setDescription(`**\`${args[0]}\`** service has **\`${lines.length}\`** accounts.`)
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
        );
    },
};