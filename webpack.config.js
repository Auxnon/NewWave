 const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const paths = [
  {
    path: '/svg/',
    lastmod: '2019-01-01',
    priority: 0.8,
    changefreq: 'yearly'
  },
  {
    path: '/desk/',
    lastmod: '2018-02-05',
    priority: 0.5,
    changefreq: 'yearly'
  },{
    path: '/fruit/',
    lastmod: '2018-02-05',
    priority: 0.5,
    changefreq: 'never'
  },{
    path: '/stomp/',
    lastmod: '2014-01-01',
    priority: 0.5,
    changefreq: 'never'
  }
];

module.exports = (env,argv) => {
	let devMode= argv.mode !== 'production';
	console.log("dev mode is "+devMode+" "+argv.mode);

return {
  mode: 'development', //'production',
  entry: './src/Main.js',
  plugins:[
  	new CleanWebpackPlugin({ 
  		dry:false,
  		cleanOnceBeforeBuildPatterns:['**/*','!styles','!styles/*','!assets','!assets/*','!assets/room/*','!partials','!partials/*','!robots.txt','!sitemap.xml'],
  		verbose: true
  	}),
  	new HtmlWebpackPlugin({template: './src/index.html'}),
  	new HtmlWebpackPlugin({ 
      filename: 'partials/about.html',
      template: './src/about.html'
    }),
    new SitemapPlugin({ "https://MakeAvoy.com", [], {lastmod:true} })
  ],
  module: {
	  rules: [
	    {
	      test: /\.css$/,
	      use: ['style-loader', 'css-loader']
	    }
	  ]
	},
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