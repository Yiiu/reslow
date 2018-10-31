export interface IScriptLoaderConfig {
  isServer: boolean;
}

export default (_: IScriptLoaderConfig) => {
  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      // require.resolve('cache-loader'),
      {
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [
            require.resolve('react-hot-loader/babel'),
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            require.resolve('@babel/plugin-proposal-object-rest-spread'),
            require.resolve('@babel/plugin-proposal-class-properties'),
            [require.resolve('@babel/plugin-transform-runtime'), {
              corejs: 2,
            }],
            require.resolve('react-loadable/babel'),
          ],
        },
      },
      {
        loader: require.resolve('ts-loader'),
      },
    ],
  };
};
