// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('../config.json');

// export command
module.exports = {
    
    // command name
	name: 'create',

    // command description
	description: 'Create a service.',

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

        // write file
        fs.writeFile(filePath, '', function (error) {

            // if error
            if (error) {
                
                // write to console
                console.log(error);
            };

            // send message to channel
            message.channel.send(
                new Discord.MessageEmbed()
                .setColor(config.color.green)
                .setTitle('Service created!')
                .setDescription(`New ${args[0]} service created!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            );
        });
    },
};