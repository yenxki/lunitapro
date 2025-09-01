const fs = require("fs");
const path = require("path");
const economyPath = path.join(__dirname, "../data/economy.json");

const abbreviate = (num) => {
  const units = ["", "k", "m", "b", "t", "q", "qi", "sx", "sp", "oc", "no", "dc"];
  let index = 0;
  while (num >= 1000 && index < units.length - 1) {
    num /= 1000;
    index++;
  }
  return `${num % 1 === 0 ? num : num.toFixed(2)}${units[index]}`;
};

const loadEconomy = () => JSON.parse(fs.readFileSync(economyPath, "utf8"));
const saveEconomy = (data) => fs.writeFileSync(economyPath, JSON.stringify(data, null, 2));

module.exports = { abbreviate, loadEconomy, saveEconomy };
