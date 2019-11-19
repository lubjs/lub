"use strict";

const lubLog = require("../index");
const { Writable } = require("stream");
const assert = require("assert");
const debug = require("debug");
const mm = require("mm");

describe("lub-log", () => {
  let output = "";
  let errOutput = "";
  beforeEach(() => {
    output = "";
    errOutput = "";
    mm(
      process,
      "stdout",
      new Writable({
        decodeStrings: false,
        write(chunk, _, callback) {
          output += chunk;
          callback();
        }
      })
    );

    mm(
      process,
      "stderr",
      new Writable({
        decodeStrings: false,
        write(chunk, _, callback) {
          errOutput += chunk;
          callback();
        }
      })
    );

    const RealDate = Date;

    mm(
      global,
      "Date",
      class extends RealDate {
        getFullYear() {
          return 2019;
        }

        getMonth() {
          return 10;
        }

        getDate() {
          return 19;
        }

        getHours() {
          return 14;
        }

        getMinutes() {
          return 13;
        }

        getSeconds() {
          return 10;
        }
      }
    );
  });

  after(() => {
    mm.restore();
  });

  it("should get correct output on log method", () => {
    lubLog("lub").log("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on log method when no scope", () => {
    lubLog().log("hello lub-log");
    assert.equal(output, "hello lub-log\n");
  });

  it("should get correct output on info method", () => {
    lubLog("lub").info("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[34mℹ \u001b[39m \u001b[34minfo     \u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on warn method", () => {
    const log = lubLog("lub");
    log.warn("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[33m⚠ \u001b[39m \u001b[33mwarning  \u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on error method", () => {
    lubLog("lub").error("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[31m✖ \u001b[39m \u001b[31merror    \u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on success method", () => {
    lubLog("lub").success("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[32m✔ \u001b[39m \u001b[32msuccess  \u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on wait method", () => {
    lubLog("lub").wait("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[34m… \u001b[39m \u001b[34mwaiting  \u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on complete method", () => {
    lubLog("lub").complete("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[36m☒ \u001b[39m \u001b[36mcomplete \u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on start method", () => {
    lubLog("lub").start("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[32m▶ \u001b[39m \u001b[32mstart    \u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on watch method", () => {
    lubLog("lub").watch("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[33m… \u001b[39m \u001b[33mwatching \u001b[39m hello lub-log\n"
    );
  });

  it("should get correct output on debug method", () => {
    lubLog("lub").debug("hello lub-log");
    assert(errOutput.indexOf("hello lub-log") > -1);
  });

  it("should get correct output when log error", () => {
    lubLog("lub").error(new Error("error lub-log"));
    assert(output.indexOf("error lub-log") > -1);
    output = "";

    lubLog({
      config: { underlineMessage: true }
    }).error(new Error("error lub-log"));
    assert(
      output.indexOf("\u001b[39m \u001b[4mError: error lub-log\u001b[24m") > -1
    );
  });

  it("should throw error when no scope passed", () => {
    assert.throws(
      () => {
        lubLog("lub").scope();
      },
      { message: "No scope name was defined." }
    );
  });

  it("should get correct output with suffix and prefix", () => {
    const log = lubLog();
    log.warn({
      prefix: "lub-prefix",
      message: "hello lub-log",
      suffix: "lub-suffix"
    });
    assert.equal(
      output,
      "lub-prefix \u001b[33m⚠ \u001b[39m \u001b[33mwarning  \u001b[39m hello lub-log lub-suffix\n"
    );
  });

  it("should get empty string with suffix and prefix", () => {
    const log = lubLog();
    log.config({
      underlinePrefix: true,
      underlineSuffix: true
    });
    log.warn({
      prefix: "lub-prefix",
      suffix: "lub-suffix"
    });
    assert.equal(
      output,
      "\u001b[4mlub-prefix\u001b[24m \u001b[33m⚠ \u001b[39m \u001b[33mwarning  \u001b[39m  \u001b[4mlub-suffix\u001b[24m\n"
    );

    output = "";
    log.warn({
      prefix: "lub-prefix"
    });
    assert.equal(
      output,
      "\u001b[4mlub-prefix\u001b[24m \u001b[33m⚠ \u001b[39m \u001b[33mwarning  \u001b[39m \n"
    );

    output = "";
    log.warn({ foo: "bar" });
    assert.equal(
      output,
      "\u001b[33m⚠ \u001b[39m \u001b[33mwarning  \u001b[39m { foo: 'bar' }\n"
    );
  });

  it("should clear scope name", () => {
    const log = lubLog("lub");
    log.unscope();
    assert.equal(log._scopeName, "");
  });

  it("should get correct scope name", () => {
    const log = lubLog("lub");
    assert.equal(log.scopeName, "lub");
    log.scope("foo");
    log.warn("hello foo-log");
    assert.equal(
      output,
      "\u001b[90m[foo]\u001b[39m \u001b[90m›\u001b[39m \u001b[33m⚠ \u001b[39m \u001b[33mwarning  \u001b[39m hello foo-log\n"
    );
  });

  it("should get correct log with different config", () => {
    const log = lubLog({
      config: {
        displayDate: true,
        displayTimestamp: true,
        displayFilename: true,
        displayLabel: true,
        displayBadge: false,
        underlinePrefix: true,
        uppercaseLabel: true,
        underlineLabel: true,
        underlineMessage: true,
        underlineSuffix: true
      }
    });
    log.info("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[2019-11-19]\u001b[39m \u001b[90m[14:13:10]\u001b[39m \u001b[90m[index.test.js]\u001b[39m \u001b[90m›\u001b[39m \u001b[34m\u001b[4mINFO\u001b[24m     \u001b[39m \u001b[4mhello lub-log\u001b[24m\n"
    );

    output = "";
    log.config({
      displayDate: false
    });
    log.info("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[14:13:10]\u001b[39m \u001b[90m[index.test.js]\u001b[39m \u001b[90m›\u001b[39m \u001b[34m\u001b[4mINFO\u001b[24m     \u001b[39m \u001b[4mhello lub-log\u001b[24m\n"
    );
  });

  it("should get correct output on info method when no padEnd on String.prototype", () => {
    const originPadEnd = String.prototype.padEnd;

    String.prototype.padEnd = undefined;
    lubLog("lub").info("hello lub-log");
    assert.equal(
      output,
      "\u001b[90m[lub]\u001b[39m \u001b[90m›\u001b[39m \u001b[34mℹ \u001b[39m \u001b[34minfo     \u001b[39m hello lub-log\n"
    );
    String.prototype.padEnd = originPadEnd;
  });
});
