const path = require('path')
const fs = require('fs-extra')
const mix = require('laravel-mix')
require('dotenv').config();
//const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
require('laravel-mix-versionhash')
require('vuetifyjs-mix-extension')
require('laravel-mix-bundle-analyzer');

mix
  .js('resources/js/app.js', 'public/dist/js').vuetify('vuetify-loader')
  .sass('resources/sass/app.scss', 'public/dist/css')
  .disableNotifications()

if (mix.inProduction()) {
  mix.versionHash()
    // .extract() // Disabled until resolved: https://github.com/JeffreyWay/laravel-mix/issues/1889
    // .version() // Use `laravel-mix-versionhash` for the generating correct Laravel Mix manifest file.
} else {
  mix.sourceMaps()

  if (mix.isWatching()) {
    //mix.bundleAnalyzer(); // uncomment to view analyzer window
  }
}
//mix.bundleAnalyzer(); // uncomment to view analyzer window

mix.webpackConfig({
  plugins: [
    // new BundleAnalyzerPlugin()
    //new VuetifyLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '~': path.join(__dirname, './resources/js'),
      '@': path.join(__dirname, './resources'),
    }
  },
  output: {
    chunkFilename: 'dist/js/[chunkhash].js',
    path: mix.config.hmr ? '/' : path.resolve(__dirname, './public/')
  }
})

/*
mix.then(() => {
  if (!mix.config.hmr) {
    process.nextTick(() => publishAssets())
  }
})

function publishAssets () {
  const publicDir = path.resolve(__dirname, './public')

  if (mix.inProduction()) {
    fs.removeSync(path.join(publicDir, 'dist'))
  }

  fs.copySync(path.join(publicDir, 'build', 'dist'), path.join(publicDir, 'dist'))
  fs.removeSync(path.join(publicDir, 'build'))
}
*/
