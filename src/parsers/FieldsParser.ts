import {IField} from "../interfaces";
import {camelCase} from "lodash";
import tableparser = require("cheerio-tableparser");
import cheerio = require("cheerio");


export default class FieldsParser {
    static parse($: CheerioStatic, fieldsTable: CheerioElement): IField[] {
        tableparser($);
        let data = $(fieldsTable).parsetable();
        let result: IField[] = [];

        for (let r = 1; r < data[0].length; r++) {
            for (let c = 0; c < data.length; c++) {
                let f: any = result[r - 1];
                if (f == undefined) {
                    f = {};
                    let $ = cheerio.load(`<td>${data[c][r]}</td>`);
                    f[camelCase(data[c][0])] = $("td").text().trim();
                    result.push(f);
                }
                else {
                    let $ = cheerio.load(`<td>${data[c][r]}</td>`);
                    f[camelCase(data[c][0])] = $("td").text().trim();
                }
            }
        }

        return result;
    }
}
