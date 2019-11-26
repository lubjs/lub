"use strict";

const Command = require("../../../index");

class GitThrow extends Command {
  constructor(rawArgv, config) {
    super(rawArgv, config);
  }

  async run() {
    throw new Error("error from git-promise-throw");
  }
}

module.exports = GitThrow;
