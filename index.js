const Discord = require('discord.js');
const DriveAPi = require('./DriveAPi');
const client = new Discord.Client();

client.login("NzA0ODAwNzM3ODMzNTE3MTQ2.Xqia1g.gsf-b2N9RDuAXCCDgl-BeitUeE0")

var prefix = "!fey"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => checkPrefixAndSearch(msg))

checkPrefixAndSearch = (msg) => {
    if (msg.content.startsWith(prefix)) {
        msg.reply("Buscando...")
        getBooks(msg)
    }
}

getBooksSuccess = (books, msg) => {
    console.log("success trying to get books");
    books.forEach(element => {
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(element.name)
        .setURL(element.webViewLink)
        msg.channel.send(exampleEmbed);
    });
} 

getBooksFailure = (msg, errorMessage) => {
    console.log("error trying to get books");
    msg.reply(errorMessage)
}

getBooks = (msgObj) => {
    var searchTerm = getSearchTerm(msgObj)
    console.log("looking for: " + searchTerm);
    DriveAPi.listMyFiles(searchTerm, (books) => getBooksSuccess(books, msgObj), (errorMessage) => getBooksFailure(msgObj, errorMessage))
}

getSearchTerm = (msg) => {
    return msg.content.split(" ")[1]
}

