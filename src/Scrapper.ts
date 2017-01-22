///<reference path="./typings.d.ts"/>
import * as rp from "request-promise";
import EntityParser from "./parsers/EntityParser";
import Files from "./Files";
import MethodsParser from "./parsers/MethodsParser";
import FieldsParser from "./parsers/FieldsParser";
import ApiClass from "./tsConverters/ApiClass";
import * as templates from "./tsConverters/Templates";
import cheerio = require("cheerio");
import _ = require("lodash");
import tp = require("cheerio-tableparser");
import fs = require("fs");
import Path = require("path");


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
        let getters = "";
        let imports = "";

        fileNames.forEach((fileName, index) => {
            console.log(`--> ${index + 1}/${fileNames.length} ${fileName}`);
            let $ = cheerio.load(Files.read("html", fileName));

            let entityName = EntityParser.parseName($);

            let methods = MethodsParser.parse($);
            let fields = FieldsParser.parse($, $("#resource_fields").get(0));

            let ts = ApiClass.toTypescript(entityName, fields, methods);

            Files.write("api", entityName, ts);

            getters += templates.clientGetterTemplate(entityName);
            imports += `import {${entityName}} from "../api/${entityName}";\n`;
        });

        let etsyApiClientTS = fs.readFileSync(Files.etsyApiClientPath).toString();
        getters = `//api start\n${getters}\n//api end`;
        imports = `//imports start\n${imports}\n//imports end`;

        etsyApiClientTS = _.replace(etsyApiClientTS, /\/\/api start([^}]*)\/\/api end/, getters);
        etsyApiClientTS = _.replace(etsyApiClientTS, /\/\/imports start([^}]*)\/\/imports end/, imports);
        fs.writeFileSync(Files.etsyApiClientPath, etsyApiClientTS);
    }

    private static async downloadDocumentation() {
        console.log("Downloading documentation.");
        let urls = await this.getUrls();
        for (let url of urls) {
            let $ = await this.getCheerio(url);
            let entityName = EntityParser.parseName($);

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
