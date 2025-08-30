const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const { abbreviateNumber } = require("../../handlers/utils");

const robCooldowns = new Map();

module.exports = {
    name: "rob",
    aliases: ["steal"],
    description: "Intenta robar dinero de otro usuario",
    usage: "rob <wallet|bank> @usuario",
    category: "Economy",
    run: async(client,message,args,prefix)=>{
        const userId = message.author.id;
        const now = Date.now();
        const cd = 10*60*1000;

        if(robCooldowns.has(userId) && now < robCooldowns.get(userId)+cd){
            const remaining = Math.ceil((robCooldowns.get(userId)+cd-now)/60000);
            return message.channel.send({embeds:[new EmbedBuilder().setColor("Yellow").setDescription(`⏳ Espera ${remaining} minuto(s) para volver a robar.`)]});
        }

        const target = message.mentions.users.first();
        if(!target) return message.channel.send({embeds:[new EmbedBuilder().setColor("Red").setDescription("❌ Debes mencionar a un usuario para robar")]});
        if(target.bot || target.id===userId) return message.channel.send({embeds:[new EmbedBuilder().setColor("Red").setDescription("❌ No puedes robar a bots ni a ti mismo")]});

        const type = args[0]?.toLowerCase();
        if(!["wallet","bank"].includes(type)) return message.channel.send({embeds:[new EmbedBuilder().setColor("Yellow").setDescription("❌ Usa: `rob <wallet|bank> @usuario`")]});

        const ecoFile = "./data/economy.json";
        let eco = JSON.parse(fs.readFileSync(ecoFile,"utf8"));
        if(!eco[message.guild.id]) eco[message.guild.id]={};
        [userId,target.id].forEach(id=>{
            if(!eco[message.guild.id][id]) eco[message.guild.id][id]={wallet:0,bank:0};
        });

        const userEco = eco[message.guild.id][userId];
        const targetEco = eco[message.guild.id][target.id];

        if(type==="wallet"){
            const success = Math.random() < 0.5;
            if(success){
                const stolen = Math.min(targetEco.wallet, Math.floor(Math.random()*901)+100); // 100-1000
                userEco.wallet += stolen;
                targetEco.wallet -= stolen;
                fs.writeFileSync(ecoFile, JSON.stringify(eco,null,4));
                robCooldowns.set(userId,now);

                message.channel.send({embeds:[
                    new EmbedBuilder()
                        .setTitle("💰 Robo exitoso")
                        .setColor("Green")
                        .setDescription(`Has robado ${abbreviateNumber(stolen)} 💰 de la wallet de <@${target.id}>`)
                ]});
            }else{
                const lost = Math.min(userEco.wallet, Math.floor(Math.random()*901)+100);
                userEco.wallet -= lost;
                fs.writeFileSync(ecoFile, JSON.stringify(eco,null,4));
                robCooldowns.set(userId,now);

                message.channel.send({embeds:[
                    new EmbedBuilder()
                        .setTitle("❌ Robo fallido")
                        .setColor("Red")
                        .setDescription(`No lograste robar y perdiste ${abbreviateNumber(lost)} 💰 de tu wallet`)
                ]});
            }
        }

        if(type==="bank"){
            const embed = new EmbedBuilder()
                .setTitle("🏦 Robo al banco")
                .setColor("Orange")
                .setDescription(`Intentar robar del banco tiene **25% de éxito**, si fallas pierdes el 10% de tu dinero. ¿Deseas continuar?`);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId("confirm_rob_bank").setLabel("Confirmar").setStyle(ButtonStyle.Danger)
                );

            const msg = await message.channel.send({embeds:[embed],components:[row]});
            
            const filter = i=>i.customId==="confirm_rob_bank" && i.user.id===userId;
            const collector = msg.createMessageComponentCollector({filter,time:30000,max:1});

            collector.on("collect",i=>{
                i.deferUpdate();
                const success = Math.random() < 0.25;
                const totalMoney = targetEco.bank;

                if(success && totalMoney>0){
                    const stolen = totalMoney;
                    userEco.wallet += stolen;
                    targetEco.bank -= stolen;
                    fs.writeFileSync(ecoFile, JSON.stringify(eco,null,4));
                    robCooldowns.set(userId,now);

                    msg.edit({embeds:[
                        embed.setColor("Green").setTitle("💰 Robo exitoso").setDescription(`Has robado ${abbreviateNumber(stolen)} 💰 del banco de <@${target.id}>`)
                    ],components:[]});
                }else{
                    const lost = Math.floor(userEco.wallet*0.1);
                    userEco.wallet -= lost;
                    fs.writeFileSync(ecoFile, JSON.stringify(eco,null,4));
                    robCooldowns.set(userId,now);

                    msg.edit({embeds:[
                        embed.setColor("Red").setTitle("❌ Robo fallido").setDescription(`Fallaste y perdiste el 10% de tu dinero (${abbreviateNumber(lost)} 💰)`)
                    ],components:[]});
                }
            });
        }
    }
};
