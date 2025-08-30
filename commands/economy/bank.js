const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { abbreviateNumber } = require("../../handlers/utils");

module.exports = {
    name: "bank",
    aliases: ["dep","deposit","withdraw"],
    description: "Deposita o retira dinero del banco",
    usage: "bank <deposit|withdraw> <cantidad>",
    category: "Economy",
    run: async(client,message,args) => {
        if(!args[0] || !["deposit","withdraw"].includes(args[0].toLowerCase())){
            return message.channel.send({ embeds: [new EmbedBuilder().setColor("Yellow").setDescription("❌ Uso: `bank <deposit|withdraw> <cantidad>`")]});
        }
        const action = args[0].toLowerCase();
        const amount = args[1]?.toLowerCase() === "all" ? "all" : parseInt(args[1]);
        if(!amount && amount!=="all") return message.channel.send({ embeds: [new EmbedBuilder().setColor("Yellow").setDescription("❌ Debes poner una cantidad válida")] });

        const ecoFile = "./data/economy.json";
        let eco = JSON.parse(fs.readFileSync(ecoFile,"utf8"));
        if(!eco[message.guild.id]) eco[message.guild.id]={};
        if(!eco[message.guild.id][message.author.id]) eco[message.guild.id][message.author.id]={wallet:0,bank:0};

        const userEco = eco[message.guild.id][message.author.id];

        if(action==="deposit"){
            const depAmount = amount==="all"?userEco.wallet:amount;
            if(depAmount>userEco.wallet) return message.channel.send({ embeds:[new EmbedBuilder().setColor("Red").setDescription("❌ No tienes suficiente en tu wallet")]});
            userEco.wallet -= depAmount;
            userEco.bank += depAmount;
            fs.writeFileSync(ecoFile, JSON.stringify(eco,null,4));
            message.channel.send({ embeds:[new EmbedBuilder().setColor("Green").setDescription(`✅ Depositaste ${abbreviateNumber(depAmount)} 💰 al banco`)]});
        }

        if(action==="withdraw"){
            const withAmount = amount==="all"?userEco.bank:amount;
            if(withAmount>userEco.bank) return message.channel.send({ embeds:[new EmbedBuilder().setColor("Red").setDescription("❌ No tienes suficiente en tu banco")]});
            userEco.bank -= withAmount;
            userEco.wallet += withAmount;
            fs.writeFileSync(ecoFile, JSON.stringify(eco,null,4));
            message.channel.send({ embeds:[new EmbedBuilder().setColor("Green").setDescription(`✅ Retiraste ${abbreviateNumber(withAmount)} 💰 de tu banco`)]});
        }
    }
};
