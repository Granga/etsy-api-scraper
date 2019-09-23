import {camelCase, uniqBy} from "lodash";
import {IField, IMethod} from "../interfaces";
import FieldsParser from "./FieldsParser";

export default class MethodsParser {
    static parse($: CheerioStatic): IMethod[] {
        let result: IMethod[] = [];

        let methodTables = $("table.api_method");

        methodTables.each((index, table) => {
            let method: any = {
                docUrl: $(table).prev("h3").find("a").first().attr("href"),
            };

            let trs = $(table).find(">tbody >tr");

            trs.each((index, tr) => {
                let th = $(tr).find("th");
                let td = $(tr).find("td");
                let methodParamsTable = td.find("table.api_method_params").eq(0);

                if (methodParamsTable.length == 0) {
                    method[camelCase(th.text().trim())] = td.text().trim();
                }
                else {
                    method.parameters = MethodsParser.parseParameters($, methodParamsTable);
                }
            });

            if (!Array.isArray(method.parameters) || method.parameters == "none") {
                method.parameters = [];
            }

            result.push(method as IMethod);
        });

        result = uniqBy(result, m => m.methodName);


        return result;
    }

    static parseParameters($: CheerioStatic, paramsTable: Cheerio): IField[] {
        return FieldsParser.parse($, paramsTable);
    }
}
