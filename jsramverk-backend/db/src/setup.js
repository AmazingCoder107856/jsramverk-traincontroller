/**
 * Setup database with some default data
 * Use with localhost database
 */
"use strict";

import { resetCollection } from './functions.js';

import { readFileSync } from "fs";
import { resolve } from "path";
const docs = JSON.parse(readFileSync(
    resolve(__dirname, "setup.json"),
    "utf8"
));

resetCollection("tickets", docs)
    .catch(err => console.log(err));
