const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env,argv) => {
	let devMode= argv.mode !== 'production';
	console.log("dev mode is "+devMode+" "+argv.mode);

return {
  mode: 'development', //'production',
  entry: './src/Main.js',
  plugins:[
  	new CleanWebpackPlugin({ 
  		dry:false,
  		cleanOnceBeforeBuildPatterns:['**/*','!styles','!styles/*','!assets','!assets/*','!partials','!partials/*'],
  		verbose: true
  	}),
  	new HtmlWebpackPlugin({template: './src/index.html'}),
  	new HtmlWebpackPlugin({ 
      filename: 'partials/about.html',
      template: './src/about.html'
    })
  ],
  /*module: {
    rules: [
      {
        test: /out.html$/i,
        loader: 'html-loader',
        options: {
          minimize: true,
        },
      },
    ],
  },*/
  output: {
	    filename: '[name].[contenthash].js',
	    path: path.resolve(__dirname, "public"), // string
	    // the target directory for all output files
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
				lib:{
					test: path.resolve('src/lib'),
					name: 'libs',
					chunks:'all',
				},
				
				apps:{
					test: /[\\/]App[\\/]/,
		          	name(module) {
		            const packageName = module.context.match(/[\\/]App[\\/](.*?)([\\/]|$)/)[1];
		            return packageName;
		          	},
				}
			},
		},
	},
};
}