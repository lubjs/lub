"use strict";

const path = require("path");
const Command = require("../../../../index");

class SpawnNode extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.options = {
      target: {
        description: "fork script file"
      }
    };
  }

  *run({ argv, rawArgv }) {
    if (!argv.target) {
      yield this.helper.spawn("echo");
      return;
    }
    yield this.helper.spawn(
      "node",
      [path.join(__dirname, "../scripts", argv.target)],
      rawArgv.concat("--from=test")
    );
  }
}

module.exports = SpawnNode;
