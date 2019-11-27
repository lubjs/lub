"use strict";

const path = require("path");
const Command = require("../../../../index");

class CallFnCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.options = {
      target: {
        description: "fork script file"
      }
    };
  }

  *run() {
    const empty = yield this.helper.callFn("empty");
    const promise = yield this.helper.callFn(() => Promise.resolve("promise"));
    const generator = yield this.helper.callFn(function*() {
      return "generator";
    });
    const normal = yield this.helper.callFn(function() {
      return "normal";
    });
    console.log("%s, %s, %s, %s", empty, promise, generator, normal);
  }
}

module.exports = CallFnCommand;
