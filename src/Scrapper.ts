///<reference path="./typings.d.ts"/>
import * as rp from "request-promise";
import Files from "./Files";
import ModuleParser from "./parsers/EntityParser";
import FieldsParser from "./parsers/FieldsParser";
import MethodsParser from "./parsers/MethodsParser";
import ApiClass from "./tsConverters/ApiClass";
import * as templates from "./tsConverters/Templates";
import cheerio = require("cheerio");
import fs = require("fs");


export default class Scraper {
    static async start() {
        try {
            if (Files.getFileList("html").length == 0) {
                await this.downloadDocumentation();
            }

            this.startOffline();

        }
        catch (e) {
            console.error(e);
        }
    }

    private static startOffline() {
        let fileNames = Files.getFileList("html");
        let moduleNames: string[] = [];

        fileNames.forEach((fileName, index) => {
            console.log(`--> ${index + 1}/${fileNames.length} ${fileName}`);
            let $ = cheerio.load(Files.read("html", fileName));

            let moduleName = ModuleParser.parseName($);
            moduleNames.push(moduleName);

            let methods = MethodsParser.parse($);
            let fields = FieldsParser.parse($, $("#resource_fields").eq(0));

            let ts = ApiClass.toTypescript(moduleName, fields, methods);

            Files.write("api", moduleName, ts);
        });

        let entities = templates.entities(moduleNames);

        fs.writeFileSync(Files.entitiesPath, entities);
    }

    private static async downloadDocumentation() {
        console.log("Downloading documentation.");
        let urls = await this.getUrls();
        for (let url of urls) {
            let $ = await this.getCheerio(url);
            let entityName = ModuleParser.parseName($);

            console.log(`--> ${urls.indexOf(url) + 1}/${urls.length} ${entityName}`);

            Files.write("html", entityName, $.html());
        }

        console.log("Documentation downloaded and saved.");
    }

    private static async getUrls(): Promise<string[]> {
        let url = "https://www.etsy.com/developers/documentation/getting_started/api_basics";
        let $ = await this.getCheerio(url);

        let links = $("#reference").find("li a");
        let urls: string[] = [];

        links.each((i, link) => {
            urls.push($(link).attr("href"));
        });

        urls.forEach((url, index) => {
            if (url.startsWith("/")) {
                urls[index] = "https://www.etsy.com" + url;
            }
        });

        return urls;
    }

    private static async getCheerio(url: string): Promise<CheerioStatic> {
        return rp({
            uri: url,
            transform: (body) => cheerio.load(body)
        })
    }
}
