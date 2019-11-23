module.exports = {
  plugins: ["lub-plugin-foo", "lub-plugin-bar"],
  "lub-plugin-bar": {
    env: "build"
  },
  alias: {
    "lub-plugin-bar": {
      dev: "bar-dev"
    }
  },
  task: {
    start: [
      "lub run bar",
      {
        command: "lub commit init",
        async: true,
        order: "after"
      }
    ]
  }
};
