# 📆 Convert between Excel and JS dates
This script takes into consideration the [Leap-Year bug](https://docs.microsoft.com/en-us/office/troubleshoot/excel/wrongly-assumes-1900-is-leap-year) and the date difference between 1900 and 1904 [Excel Date Systems](https://docs.microsoft.com/en-us/office/troubleshoot/excel/1900-and-1904-date-system).

# Usage

```js
// You can verify these results with the example at:
// https://docs.microsoft.com/en-us/office/troubleshoot/excel/1900-and-1904-date-system

const toExcelDate = require('js-excel-date-convert').toExcelDate;
const fromExcelDate = require('js-excel-date-convert').fromExcelDate;

const jul = new Date('jul 5 1998');

toExcelDate(jul);  // 35981 (1900 date system)

toExcelDate(jul, true); // 34519 (1904 date system)

fromExcelDate(35981); // "Sun, 05 Jul 1998 00:00:00 GMT"

fromExcelDate(34519, true);  // "Sun, 05 Jul 1998 00:00:00 GMT"
```

## API

### fromExcelDate(excelDate, date1904): `Date`
| Param     | Type      | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| excelDate | `number`  | yes      | An integer number representing a date in Excel.                                                                                                                                                                                                                                                                                                                                                                                       |
| date1904  | `boolean` | no       | Set this to `true` if the date is encoded in [1904 Date System](https://docs.microsoft.com/en-us/office/troubleshoot/excel/1900-and-1904-date-system). This is the default format for [Excel in MacOS](https://bettersolutions.com/excel/dates-times/1904-date-system.htm).<br><br> If you're using [SheetJS](https://sheetjs.gitbooks.io/docs/#dates) you can check which system the file is using by calling `wb.Workbook.WBProps.date1904` |

### toExcelDate(date, date1904): `number`
| Param    | Type      | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| date     | `Date`    | yes      | Date to encode into Excel format.                                                                                                                                                                                                                                                                                                                                                                                               |
| date1904 | `boolean` | no       | If `true`, the date will be encoded to [1904 Date System](https://docs.microsoft.com/en-us/office/troubleshoot/excel/1900-and-1904-date-system). This is the default format for [Excel in MacOS](https://bettersolutions.com/excel/dates-times/1904-date-system.htm).<br><br>If you're using [SheetJS](https://sheetjs.gitbooks.io/docs/#dates) you can check which system the file is using by calling `wb.Workbook.WBProps.date1904` |

## Credits ##
Raschid JF. Rafaelly

<https://raschidjfr.dev>
