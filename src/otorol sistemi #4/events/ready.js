const { ActivityType, Events } = require('discord.js');
const config = require('../config.json')
const mongoose = require('mongoose')

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

        client.user.setStatus(config.bot.presence.status);
        client.user.setPresence({
            activities: [{
                name: config.bot.presence.text,
                type: ActivityType.Listening
            }]
        })

        mongoose.connect(config.bot.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("MongoDB Connection Successful.");
        }).catch(err => {
            console.log("MongoDB Connection Failed: " + err);
        })

        console.log(client.user.username + "is Ready!");
    }
}