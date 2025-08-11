const units = ["", "k", "m", "b", "t", "q", "qi", "sx", "sp", "oc", "no", "dc"];

module.exports = {
    format: (num) => {
        if (num < 1000) return num.toString();
        let i = 0;
        while (num >= 1000 && i < units.length - 1) {
            num /= 1000;
            i++;
        }
        return parseFloat(num.toFixed(2)) + units[i];
    },

    parse: (str) => {
        str = str.toLowerCase().replace(/,/g, "");
        const match = str.match(/^(\d+(\.\d+)?)([a-z]*)$/);
        if (!match) return NaN;

        const num = parseFloat(match[1]);
        const unit = match[3] || "";
        const index = units.indexOf(unit);

        if (index === -1) return NaN;
        return Math.floor(num * Math.pow(1000, index));
    }
};
