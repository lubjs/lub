#!/usr/bin/env node

"use strict";

const Clone = require("../index");

const gitClone = new Clone(undefined, { quiet: true });
gitClone.start();
