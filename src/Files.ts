import fs = require("fs");
import Path = require("path");
import { upperFirst } from "lodash";

export default class Files {
    static outputDir = Path.join(__dirname, "../", "/output");
    static htmlDir = Path.join(Files.outputDir, "/html");
    static jsonDir = Path.join(Files.outputDir, "/json");
    static etsyTsSrcDir = Path.join("../", "/etsy-ts/src");
    static apiDir = Path.join(Files.etsyTsSrcDir, "api");
    static apiIndexPath = Path.join(Files.apiDir, "index.ts");
    static entitiesPath = Path.join(Files.etsyTsSrcDir, "client", "Entities.ts");

    static createDirs() {
        let dirs = [this.outputDir, this.htmlDir, this.jsonDir, this.apiDir];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
    }

    static write(type: "html" | "entityJson" | "api" | "apiIndex", name: string, content: string) {
        let path = this.getPath(type, name);

        let dir = Path.dirname(path);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(path, content);
        console.log(path);
    }

    static read(type: "html" | "entityJson", name: string): string {
        if (type == "html")
            name = name.replace(".html", "");

        if (type == "entityJson")
            name = name.replace(".json", "");

        let path = this.getPath(type, name);

        return fs.readFileSync(path).toString();
    }

    static getPath(type: "html" | "entityJson" | "api" | "apiIndex", name: string): string {
        switch (type) {
            case "html":
                return Path.join(this.htmlDir, `${name}.html`);

            case "entityJson":
                return Path.join(this.jsonDir, `${name}.json`);

            case "api":
                return Path.join(this.apiDir, `${upperFirst(name)}.ts`);

            case "apiIndex":
                return Path.join(this.apiIndexPath);

            default:
                console.warn("Unknown type");
        }
    }

    static getFileList(type: "html"): string[] {
        switch (type) {
            case "html":
                return fs.readdirSync(this.htmlDir) as string[];
            default:
                console.warn("Unknown type");
        }
    }

    private static getDirectories(srcpath) {
        return fs.readdirSync(srcpath).filter(function (file) {
            return fs.statSync(Path.join(srcpath, file)).isDirectory();
        });
    }
}

Files.createDirs();
