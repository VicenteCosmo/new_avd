
/**
 * Decode an excel date
 * @param excelDate Date value from excel (an int number)
 * @param date1904 Whether to use the 1904 Date System. See https://bettersolutions.com/excel/dates-times/1904-date-system.htm
 * @author Raschid JF Rafaelly <hello&commat;raschidjdr.dev>
 */
export function fromExcelDate (excelDate: number, date1904?: boolean): Date;

/**
 * Encode date to excel
 * @param date
 * @param date1904 Whether to use the 1904 Date System. See https://bettersolutions.com/excel/dates-times/1904-date-system.htm
 * @author Raschid JF Rafaelly <hello&commat;raschidjdr.dev>
 */
export function toExcelDate (date: Date, date1904?: boolean): number;
