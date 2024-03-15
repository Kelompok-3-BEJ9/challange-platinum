// File: dateUtils.js
function getFormattedDate() {
  const date = new Date();
  const dateFormat = `${date.getFullYear()}-${
    (date.getMonth() + 1).toString().padStart(2, "0") // Pad with zero if single digit
  }-${date
    .getDate()
    .toString()
    .padStart(
      2,
      "0"
    )} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return dateFormat;
}

module.exports = { getFormattedDate };
