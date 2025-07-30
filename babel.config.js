module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: '18' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@bot': './src/bot',
        '@controller': './src/controller/index.ts',
        '@core': './src/core',
        '@domain': './src/domain',
        '@infrastructure': './src/infrastructure',
        '@middlewares': './src/middlewares',
        '@utils': './src/utils'
      }
    }]
  ]
};