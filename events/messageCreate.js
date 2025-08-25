import fs from "fs";

export default {
    name: "messageCreate",
    async execute(client, message) {
        if (message.author.bot) return;

        // ModMail
        if (message.channel.type === 1) {
            const config = JSON.parse(fs.readFileSync("./database/modmail.json", "utf8"));
            if (!config.channelId) return;

            const channel = await client.channels.fetch(config.channelId);
            if (!channel) return;

            channel.send({
                embeds: [{
                    title: "📬 Nuevo mensaje por DM",
                    description: `**Usuario:** ${message.author.tag}\n**ID:** ${message.author.id}\n\n${message.content}`,
                    color: 0x3498db
                }]
            });
        }
    }
};
