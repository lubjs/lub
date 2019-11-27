"use strict";

const path = require("path");
const Command = require("../../../../index");

class ForkNode extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.options = {
      target: {
        description: "fork script file"
      }
    };
  }

  *run({ argv }) {
    yield this.helper.forkNode(path.join(__dirname, "../scripts", argv.target));
  }
}

module.exports = ForkNode;
