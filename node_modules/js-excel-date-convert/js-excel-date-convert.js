
/**
 * Decode an excel date
 * @param {number} excelDate Date value from excel (an int number)
 * @param {boolean} [date1904] Whether to use the 1904 Date System. See https://bettersolutions.com/excel/dates-times/1904-date-system.htm
 * @author Raschid JF Rafaelly <hello&commat;raschidjdr.dev>
 */
function fromExcelDate (excelDate, date1904) {
  const daysIn4Years = 1461;
  const daysIn70years = Math.round(25567.5 + 1); // +1 because of the leap-year bug
  const daysFrom1900 = excelDate + (date1904 ? daysIn4Years + 1 : 0);
  const daysFrom1970 = daysFrom1900 - daysIn70years;
  const secondsFrom1970 = daysFrom1970 * (3600 * 24);
  const utc = new Date(secondsFrom1970 * 1000);
  return !isNaN(utc) ? utc : null;
}

/**
 * Encode date to excel
 * @param {Date} date
 * @param {boolean} [date1904] Whether to use the 1904 Date System. See https://bettersolutions.com/excel/dates-times/1904-date-system.htm
 * @author Raschid JF Rafaelly <hello&commat;raschidjdr.dev>
 */
function toExcelDate (date, date1904) {
  // see https://bettersolutions.com/excel/dates-times/1904-date-system.htm
  if (isNaN(date)) return null;
  const daysIn4Years = 1461;
  const daysIn70years = Math.round(25567.5 + 1); // +1 because of the leap-year bug
  const daysFrom1970 = date.getTime() / 1000 / 3600 / 24;
  const daysFrom1900 = daysFrom1970 + daysIn70years;
  const daysFrom1904Jan2nd = daysFrom1900 - daysIn4Years - 1;
  return Math.round(date1904 ? daysFrom1904Jan2nd : daysFrom1900);
}

module.exports = {
  fromExcelDate,
  toExcelDate
};
