function abbreviateNumber(value){
    if(value>=1e12) return (value/1e12).toFixed(2)+"T";
    if(value>=1e9) return (value/1e9).toFixed(2)+"B";
    if(value>=1e6) return (value/1e6).toFixed(2)+"M";
    if(value>=1e3) return (value/1e3).toFixed(2)+"K";
    return value.toString();
}

module.exports = { abbreviateNumber };
