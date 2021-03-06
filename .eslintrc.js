// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 逗号前后空格
    'comma-spacing': 0,
    // 分号前后空格
    "semi-spacing": [0, {"before": false, "after": false}],
    // 引号类型 `` "" ''
    "quotes": [0, "single"],
    // 中缀操作符周围要不要有空格
    "space-infix-ops": 0,
    // 强制驼峰法命名
    "camelcase": 0
  }
}
