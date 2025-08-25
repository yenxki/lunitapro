function formatNumber(num) {
  const abbreviations = ['','k','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];
  let i = 0;
  while(num >= 1000 && i < abbreviations.length-1) {
    num /= 1000;
    i++;
  }
  return num.toFixed(2) + abbreviations[i];
}

module.exports = { formatNumber };
