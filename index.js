const Discord = require('discord.js');
const DriveAPi = require('./DriveAPi');
const client = new Discord.Client();

client.login("ytLunj78dToGKC2YCRY0qTBm-vNX9BzR")

var prefix = "!feynman"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith(prefix)) {
        msg.reply("Buscando...")
        let searchFiles =  msg.content.split(" ")[1]
        DriveAPi.listMyFiles(searchFiles, (books) => {
            books.forEach(element => {
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(element.name)
                .setURL(element.webViewLink)
                msg.channel.send(exampleEmbed);
            });
        }, () => {
            msg.reply("Não consegui achar arquivo com esse nome")
        })
    }
});
