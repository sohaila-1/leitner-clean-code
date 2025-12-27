module.exports = {
  default: {
    requireModule: ["ts-node/register"],

    require: [
      "./support/world.ts",
      "./support/hooks.ts",
      "./steps/**/*.ts",
    ],

    paths: ["./features/**/*.feature"],
    format: ["progress"],
    publishQuiet: true,
    timeout: 60000,
  },
};