var path = require('path');

module.exports = {
    entry: './webpack.entry.js',
    output: { 
        path: path.join(__dirname, 'public', 'javascripts'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-2']
                }
            },
            {
                test:   /\.s?css/,
                loaders: ['style', 'css', 'sass']
            }
        ]
    }
};