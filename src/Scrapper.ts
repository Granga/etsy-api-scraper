///<reference path="./typings.d.ts"/>
import * as rp from "request-promise";
import EntityParser from "./parsers/EntityParser";
import Files from "./Files";
import MethodsParser from "./parsers/MethodsParser";
import FieldsParser from "./parsers/FieldsParser";
import Fields from "./tsConverters/Fields";
import Methods from "./tsConverters/Methods";
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

        fileNames.forEach((fileName, index) => {
            console.log(`--> ${index + 1}/${fileNames.length} ${fileName}`);
            let $ = cheerio.load(Files.load("html", fileName));

            let entityName = EntityParser.parseName($);

            let methods = MethodsParser.parse($);
            let fields = FieldsParser.parse($, $("#resource_fields").get(0));

            let imports =
                'import * as Bluebird from "bluebird";\n' +
                'import {request} from "../common/HttpRequest";\n' +
                'import {IStandardParameters} from "../common/IStandardParameters";\n' +
                'import {IStandardResponse} from "../common/IStandardResponse";\n';

            let fieldsTS = Fields.toTypescript(fields, "interface", "I" + entityName);
            let methodsTS = Methods.toTypescript(methods);

            let typescript = imports + "\n\n" + fieldsTS + "\n\n" + methodsTS;

            Files.write("api", entityName, typescript);
        });

        Files.createReExportsFile();
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
