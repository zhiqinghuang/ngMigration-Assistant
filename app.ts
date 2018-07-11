/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as fs from 'fs'; //access to fs library

export class AppStats {

    public jsFileCount: number;
    public tsFileCount: number;
    public MAX_CODE_LIMIT: number = 880; //880 lines is considered to be 1 month's worth of effecient coding 
    public path: string; //not sure if need to make a path property..?

    constructor(path: string) {
        this.path = path;
        this.jsFileCount = 0;
        this.tsFileCount = 0;
    }

    public recommendation() {
        this.decisionTree();
    }

    public decisionTree() {
        setTimeout(() => { }, 100000);
        this.traverseFileSystem();

        //Scripting Language/Unit Tests checks: (1) Check is has JS and no TS, 
        //(2) has both, then check if JS > TS or if TS >= JS. Also check for unit tests here.
        //If TS >= JS, this means they are already at TS conversion.
        console.log("Js: " + this.jsFileCount + " Ts: " + this.tsFileCount);
        if (this.jsFileCount > 0 && this.tsFileCount == 0) {
            this.MAX_CODE_LIMIT *= (this.jsFileCount / 10);
        } else if (this.jsFileCount > 0 && this.tsFileCount > 0) {
            if (this.jsFileCount > this.tsFileCount) {
                let jsFilesNeedConverting = this.jsFileCount - this.tsFileCount;
                console.log("You still have " + jsFilesNeedConverting + " JavaScript file left to convert to TypeScript.")
                this.MAX_CODE_LIMIT *= (jsFilesNeedConverting / 10);
                if (!this.checkUnitTests) {
                    this.MAX_CODE_LIMIT *= 1.5;
                }
            } else if (this.jsFileCount <= this.tsFileCount) {
                if (!this.checkUnitTests) {
                    this.MAX_CODE_LIMIT *= 1.5;
                    console.log("No unit test!");
                } else {
                    console.log("Good Job, you have have already converted to Typescript!");
                }
            }
        }
    }

    public traverseFileSystem() {
        console.log("Descending into " + this.path);
        const list = fs.readdirSync(this.path); //read the passed in file path and return a string array of filenames

        for (let i = 0; i < list.length; i++) {
            console.log(list[i]);
            this.checkUnitTests(list[i]);
            this.countScriptingFiles(list[i]);
            this.checkAngularVersion(list[i]);
            // this.checkRootscope(list[i]);   

            if (fs.statSync(this.path + "/" + list[i]).isDirectory()) { // must attach current file to next file to produce correct directory
                this.path += "/" + list[i];
                this.traverseFileSystem(); // if not, go to the child file or next file down
                //will print undefined unless add a return statement!
            }
        }
    }

    public checkUnitTests(filename: string) {
        if (filename.substr(-7, 4) === 'spec') {
            console.log("Spec found: true!");
            return true;
        }
        return false;
    }

    public countScriptingFiles(filename: string) {
        if (filename.substr(-3) === '.js') { //check if current filename/folder is js file
            this.jsFileCount++;
        } else if (filename.substr(-3) === ".ts") {
            this.tsFileCount++;
        }
    }

    public x(filename: string) {
    }

    public checkAngularVersion(filename: string) {

    }

    public checkRootscope(filename: string) {

    }
}