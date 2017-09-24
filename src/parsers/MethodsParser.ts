import {IParsedMethod, IParsedField} from "../interfaces";
import FieldsParser from "./FieldsParser";
import {camelCase, uniqBy} from "lodash";

export default class MethodsParser {
    static parse($: CheerioStatic): IParsedMethod[] {
        let result: IParsedMethod[] = [];

        let methodTables = $("table.api_method");

        methodTables.each((index, table) => {
            let method: any = {
                docUrl: $(table).prev("h3").find("a").first().attr("href"),
            };

            let trs = $(table).find(">tbody >tr");

            trs.each((index, tr) => {
                let th = $(tr).find("th");
                let td = $(tr).find("td");
                let methodParamsTable = td.find("table.api_method_params").get(0);

                if (!methodParamsTable) {
                    method[camelCase(th.text().trim())] = td.text().trim();
                }
                else {
                    method.parameters = MethodsParser.parseParameters($, methodParamsTable);
                }
            });

            if (!Array.isArray(method.parameters) || method.parameters == "none") {
                method.parameters = [];
            }

            result.push(method as IParsedMethod);
        });

        result = uniqBy(result, m => m.methodName);


        return result;
    }

    static parseParameters($: CheerioStatic, paramsTable: CheerioElement): IParsedField[] {
        return FieldsParser.parse($, paramsTable);
    }
}
