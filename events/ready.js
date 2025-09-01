module.exports = (client) => {
  console.log(`${client.user.tag} está online 🚀`);
  client.user.setActivity("a Gerasaurio", { type: 3 }); // WATCHING
};
