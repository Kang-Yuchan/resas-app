module.exports = {
  presets: [["@babel/preset-env"]],
  env: {
    test: {
      plugins: ["transform-es2015-modules-commonjs"],
    },
  },
};
