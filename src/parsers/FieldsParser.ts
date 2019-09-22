import {camelCase} from "lodash";
import {IField} from "../interfaces";

export default class FieldsParser {
    static parse($: CheerioStatic, fieldsTable: Cheerio): IField[] {
        let result: IField[] = [];

        let numRows = fieldsTable.find("tbody > tr").length;
        let numCols = fieldsTable.find("tbody > tr").first().find("th").length;

        for (let r = 1; r < numRows; r++) {
            let field: IField = {
                type: "",
                isDeprecated: false,
            };
            let row = this.getRow(r, fieldsTable);

            if (this.getCell(r, 0, fieldsTable).attr("colspan") == "4") {
                // field in previous row is deprecated
                field = result[result.length - 1];
                if (field) {
                    field.deprecatedDescription = this.getCell(r, 0, fieldsTable).text().trim();
                }
                continue;
            }

            for (let c = 0; c < numCols; c++) {
                let th = this.getHeader(0, c, fieldsTable);
                let cell = this.getCell(r, c, fieldsTable);
                field.isDeprecated = row.is(".deprecated");
                field[camelCase(th.text().trim())] = cell.text().trim();
            }

            result.push(field);
        }


        return result;
    }

    private static getHeader(r: number = 0, c: number, fieldsTable: Cheerio): Cheerio {
        let row = this.getRow(r, fieldsTable);
        return row.find("th").eq(c);
    }

    private static getCell(r: number, c: number, fieldsTable: Cheerio): Cheerio {
        let row = this.getRow(r, fieldsTable);
        return row.find("td").eq(c);
    }

    private static getRow(r: number, fieldsTable: Cheerio): Cheerio {
        return fieldsTable.find("tr").eq(r);
    }
}
