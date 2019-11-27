"use strict";

const Command = require("../../../index");

class GitClone extends Command {
  constructor(rawArgv, config) {
    super(rawArgv, config);
    this.usage = "clone <repository> [directory]";
    this.description = "Clone a repository into a new directory";
    this.version = "v1.0.0";
    this.options = {
      depth: {
        type: "number",
        description:
          "Create a shallow clone with a history truncated to the specified number of commits"
      }
    };
  }

  *run({ argv }, { quiet }) {
    if (quiet) {
      console.log("set quiet mode");
    }
    console.log(this.description);
    const [repository, directory] = argv._;
    console.log(
      "git clone %s to %s with depth %d",
      repository,
      directory,
      argv.depth
    );
  }
}

module.exports = GitClone;
