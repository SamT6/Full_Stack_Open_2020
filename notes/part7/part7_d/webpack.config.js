const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
    console.log('argv', argv.mode);

    const backend_url = argv.mode === 'production'
        ? 'https://blooming-atoll-75500.herokuapp.com/api/notes'
        : 'http://localhost:3001/notes'

    return {
        entry: ['@babel/polyfill', './src/index.js'], // the entry point for bundling the application
        output: {
            path: path.resolve(__dirname, 'build'), //defined as an absolute path, __dirname which is a global variable in Node that stores the path to the current directory
            filename: 'main.js'
        },
        devServer: {
            static: path.resolve(__dirname, 'build'),
            compress: true,
            port: 3000,
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    // a loader that transforms the JSX code into regular JavaScript
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],  
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                BACKEND_URL: JSON.stringify(backend_url)
            })
        ]
    }
}

module.exports = config 