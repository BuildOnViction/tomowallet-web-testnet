const path = require('path')
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: './app/app.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.min.js',
            '@': resolve('app'),
        }
    },
    module: {
        rules: [
            { test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ],
        loaders: [
      { test: /\.json$/, use: 'json-loader' },
            {
                test: /\.js$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    }
}
