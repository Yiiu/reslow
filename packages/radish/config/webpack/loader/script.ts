export interface IScriptLoaderConfig {
  isServer: boolean;
}

export default ({
  isServer = false
}: IScriptLoaderConfig) => {
  return {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          plugins: [
            'react-hot-loader/babel',
            'syntax-dynamic-import',
            'transform-class-properties',
            'transform-object-assign',
            'react-loadable/babel'
          ]
        }
      },
      {
        loader: 'ts-loader'
      }
    ]
  };
};
