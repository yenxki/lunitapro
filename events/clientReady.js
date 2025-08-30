module.exports = (client)=>{
    console.log("✅ Bot listo!");
    client.user.setPresence({
        activities:[{name:"Gerasaurio en TikTok",type:3}],
        status:"online"
    });
};
