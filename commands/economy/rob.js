const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const { abbreviateNumber } = require("../../handlers/utils");
const { checkCooldown } = require("../../handlers/cooldowns");

module.exports = {
    name: "rob",
    aliases: [],
    description: "Intenta robar dinero de otro usuario",
    usage: "rob <@usuario>",
    category: "Economy",
    run: async (client, message, args) => {
        const target = message.mentions.users.first();
        const user = message.author;
        const guildId = message.guild.id;
        const cooldownTime = 60 * 60 * 1000; // 1 hora

        if (!target) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Yellow")
                    .setDescription(`${client.emojisData.info} Debes mencionar a un usuario para robar.`)
            ]
        });

        if (target.id === user.id) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Yellow")
                    .setDescription(`${client.emojisData.info} No puedes robarte a ti mismo.`)
            ]
        });

        const timeLeft = checkCooldown(user.id, "rob", cooldownTime);
        if (timeLeft) {
            const minutes = Math.floor(timeLeft / 60000);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription(`${client.emojisData.info} Ya intentaste robar recientemente. Vuelve en ${minutes} minutos.`)
                ]
            });
        }

        let eco = JSON.parse(fs.readFileSync("./data/economy.json", "utf8"));
        if (!eco[guildId]) eco[guildId] = {};
        if (!eco[guildId][user.id]) eco[guildId][user.id] = { wallet: 0, bank: 0 };
        if (!eco[guildId][target.id]) eco[guildId][target.id] = { wallet: 0, bank: 0 };

        if (eco[guildId][target.id].wallet < 50) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription(`${client.emojisData.info} Este usuario no tiene suficiente dinero para robar.`)
                ]
            });
        }

        // Probabilidad de éxito: 50%
        const success = Math.random() < 0.5;
        const amount = Math.floor(Math.random() * Math.min(eco[guildId][target.id].wallet, 500)) + 50;

        if (success) {
            eco[guildId][target.id].wallet -= amount;
            eco[guildId][user.id].wallet += amount;

            fs.writeFileSync("./data/economy.json", JSON.stringify(eco, null, 4));

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle(`${client.emojisData.success} Robo exitoso`)
                        .setDescription(`Has robado **${abbreviateNumber(amount)} 💰** de ${target.tag}!\nTu billetera ahora tiene \`${abbreviateNumber(eco[guildId][user.id].wallet)} 💰\``)
                ]
            });
        } else {
            fs.writeFileSync("./data/economy.json", JSON.stringify(eco, null, 4));

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle(`${client.emojisData.error} Robo fallido`)
                        .setDescription(`No lograste robar a ${target.tag}. Ten cuidado y vuelve a intentarlo más tarde.`)
                ]
            });
        }
    }
};
