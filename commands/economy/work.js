const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { abbreviateNumber } = require("../../handlers/utils");

const workCooldowns = new Map();

module.exports = {
    name: "work",
    description: "Gana dinero trabajando",
    category: "Economy",
    run: async (client, message) => {

        const userId = message.author.id;
        const now = Date.now();
        const cooldown = 30*60*1000;

        if(workCooldowns.has(userId) && now<workCooldowns.get(userId)+cooldown){
            const remaining = Math.ceil((workCooldowns.get(userId)+cooldown-now)/60000);
            return message.channel.send({ embeds:[new EmbedBuilder().setColor("Yellow").setDescription(`⏳ Espera ${remaining} minuto(s) para volver a trabajar.`)] });
        }

        workCooldowns.set(userId, now);

        const ecoFile = "./data/economy.json";
        const jobsFile = "./data/workJobs.json";
        let eco = JSON.parse(fs.readFileSync(ecoFile,"utf8"));
        if(!eco[message.guild.id]) eco[message.guild.id]={};
        if(!eco[message.guild.id][userId]) eco[message.guild.id][userId]={wallet:0,bank:0};

        const jobs = JSON.parse(fs.readFileSync(jobsFile,"utf8"));
        const keys = Object.keys(jobs);
        const jobKey = keys[Math.floor(Math.random()*keys.length)];
        const job = jobs[jobKey];

        const earnings = Math.floor(Math.random()*(job.max-job.min+1))+job.min;
        eco[message.guild.id][userId].wallet += earnings;
        fs.writeFileSync(ecoFile, JSON.stringify(eco,null,4));

        const msgTemplate = job.messages[Math.floor(Math.random()*job.messages.length)].replace("{money}", abbreviateNumber(earnings));

        message.channel.send({
            embeds:[new EmbedBuilder()
                .setColor("Green")
                .setTitle(`${job.emoji} Trabajo completado`)
                .setDescription(`${msgTemplate}\nWallet: \`${abbreviateNumber(eco[message.guild.id][userId].wallet)} 💰\``)
            ]
        });
    }
};
