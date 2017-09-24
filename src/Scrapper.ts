///<reference path="./typings.d.ts"/>
import * as rp from "request-promise";
import Files from "./Files";
import {IHTMLResult} from "./HTML/IHTMLResult";
import {ApiMethodsJsonParser} from "./parsers/ApiMethodsJsonParser";
import ModuleParser from "./parsers/EntityParser";
import {IRESTResult} from "./REST/IRestResult";
import {Method} from "./REST/Method";
import {Module} from "./REST/Module";
import {Parameter} from "./REST/Parameter";
import {Templates} from "./tsConverters/Templates";
import cheerio = require("cheerio");
import fs = require("fs");
import fetch = require("node-fetch");
import prettier = require("prettier");


export default class Scraper {
    static async start() {
        try {
            if (Files.getFileList("html").length == 0) {
                await this.downloadDocumentation();
            }

            let restResult = await this.fetchREST();
            let htmlResult = await this.fetchHTML();

            let modules = this.combine(restResult, htmlResult);
            this.write(modules);
        }
        catch (e) {
            console.error(e);
        }
    }

    private static combine(restResult: IRESTResult, htmlResult: IHTMLResult) {
        let modules: Module[] = [];

        for (let htmlModule of htmlResult.modules) {

            let module = new Module(htmlModule.name, htmlModule.fields);

            for (let htmlMethod of htmlModule.methods) {
                let restMethod = restResult.methods.find(m => m.name == htmlMethod.methodName);

                if (!restMethod) {
                    console.warn(`Method found in HTML, but not in REST. Method: ${htmlMethod.methodName}, Module: ${module.name}`);

                    restMethod = new Method({
                        name: htmlMethod.methodName,
                        description: htmlMethod.synopsis,
                        uri: htmlMethod.uri,
                        params: [],
                        http_method: htmlMethod.httpMethod,
                        type: "any",
                        defaults: [],
                        visibility: "public"
                    });

                    restMethod.params = htmlMethod.parameters.map(p => {
                        return new Parameter(p.name, p.type, p.default)
                    });
                }

                restMethod.extend(htmlMethod);

                for (let parameter of restMethod.params) {
                    let htmlParam = htmlMethod.parameters.find(p => p.name === parameter.name);

                    if (!htmlParam) {
                        console.warn(`Parameter found in REST, but not in HTML. Parameter: ${parameter.name}, Method: ${restMethod.name}, Module: ${module.name}`);
                    }
                    parameter.extend(htmlParam);
                }

                module.methods.push(restMethod);
            }

            modules.push(module)
        }

        return modules;
    }

    private static write(modules: Module[]) {
        let prettierConfig = {
            "parser": "typescript",
            printWidth: Infinity
        } as prettier.Options;

        for (let module of modules) {
            Files.write("api", module.name, prettier.format(module.toString(), prettierConfig));
        }

        let index = Templates.index(modules.map(m => m.name));
        fs.writeFileSync(Files.indexPath, prettier.format(index, prettierConfig));
    }


    static async fetchREST(): Promise<IRESTResult> {
        let url = "https://www.etsy.com/api/v2/ajax/";

        let json = await fetch(url).then(reply => reply.json());

        return {methods: await ApiMethodsJsonParser.parse(json)} as IRESTResult;
    }

    static async fetchHTML() {
        let fileNames = Files.getFileList("html");

        let modules = fileNames
            //.slice(0, 5)
            .map((fileName, index) => {
                console.log(`--> ${index + 1}/${fileNames.length} ${fileName}`);
                let $ = cheerio.load(Files.read("html", fileName));
                return ModuleParser.parseModule($);
            });

        return {
            modules
        } as IHTMLResult;
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
