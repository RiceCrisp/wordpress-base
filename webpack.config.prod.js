const gettext = require('gettext-parser')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const wpPot = require('wp-pot')
const AssetsPlugin = require('assets-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const themeDir = 'wp-content/themes/ws/'
const themeJSON = require('./' + themeDir + 'theme.json')

class TranslationPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Translation Plugin', stats => {
      console.log('Generating .pot file')
      wpPot({
        destFile: themeDir + 'languages/ws.pot',
        domain: 'ws',
        src: [themeDir + '**/*.php', themeDir + 'src/**/*.js']
      })
      fs.readFile(themeDir + 'languages/ws.po', function read(err, data) {
        if (err) {
          return
        }
        console.log('Generating .mo file')
        const output = gettext.mo.compile(gettext.po.parse(data))
        fs.writeFileSync(themeDir + 'languages/ws.mo', output)
      })
    })
  }
}

function postcssPrepend(options = {}) {
  return {
    postcssPlugin: 'postcss-prepend',
    Once (root, { result }) {
      let output = ''

      const colorVariables = themeJSON.settings.color.palette.map(color => `$${color.slug}:${color.color};`)
      output += colorVariables.join('')
      const colors = themeJSON.settings.color.palette.map(color => `${color.slug}:$${color.slug}`)
      output += `$colors:(${colors.join(',')});`

      const gradientVariables = themeJSON.settings.color.gradients.map(gradient => `$${gradient.slug}:${gradient.gradient};`)
      output += gradientVariables.join('')
      const gradients = themeJSON.settings.color.gradients.map(gradient => `${gradient.slug}:${gradient.gradient}`)
      output += `$gradients:(${gradients.join(',')});`

      if (root.source.input.file.includes('src/css/front/front.css') || root.source.input.file.includes('src/css/admin/admin.css')) {
        const fonts = themeJSON.fonts.map(font => {
          if (font.weight === 'variable') {
            const type = font.src.split('.')[1]
            return `@font-face{font-family:'${font.name}';src:url('${font.src}')format('${type} supports variations'),url('${font.src}')format('${type}-variations');font-weight:300 700;font-style:normal;font-display:swap;}`
          }
          return `@font-face{font-family:'${font.name}';src:url('${font.src}');font-weight:${font.weight};font-style:normal;font-display:swap;}`
        })
        output += fonts.join('')
      }

      root.prepend(output)
    }
  }
}
postcssPrepend.postcss = true

module.exports = (env, argv) => {
  const plugins = [
    new AssetsPlugin({
      filename: 'assets.json',
      fullPath: false,
      path: path.resolve(__dirname, themeDir + 'dist')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].min.css'
    }),
    new TranslationPlugin()
  ]
  if (env && env.lint) {
    plugins.push(
      new StyleLintPlugin({
        configFile: '.stylelintrc',
        files: themeDir + 'src/**/*.css',
        syntax: 'scss'
      }),
      new ESLintPlugin({
        context: path.resolve(__dirname, themeDir),
        files: [
          'src/**/*.js',
          'blocks/**/*.js'
        ]
      })
    )
  }
  return {
    mode: 'production',
    externals: {
      'react': 'React',
      'react-dom' : 'ReactDOM'
    },
    resolve: {
      alias: {
        '@ws/components': path.resolve(__dirname, themeDir + 'src/js/admin/components/index.ts'),
        '@ws/hooks': path.resolve(__dirname, themeDir + 'src/js/admin/hooks/index.ts'),
        '@ws/modules': path.resolve(__dirname, themeDir + 'src/js/front/modules'),
        '@ws/theme': path.resolve(__dirname, themeDir + 'theme.json'),
        '@ws/types': path.resolve(__dirname, themeDir + 'src/js/types.ts'),
        '@ws/utils': path.resolve(__dirname, themeDir + 'src/js/utils.ts')
      },
      extensions: ['.tsx', '.ts', '.js']
    },
    entry: {
      'front-js': path.resolve(__dirname, themeDir + 'src/js/front/front.ts'),
      'front-css': path.resolve(__dirname, themeDir + 'src/css/front/front.css'),
      'admin-css': [
        path.resolve(__dirname, themeDir + 'src/css/admin/admin.css'),
        ...glob.sync(path.resolve(__dirname, themeDir + 'blocks/*/admin.css'))
      ],
      'blocks-js': path.resolve(__dirname, themeDir + 'src/js/admin/blocks.ts'),
      'options-js': path.resolve(__dirname, themeDir + 'src/js/admin/options.ts'),
      ...glob.sync(path.resolve(__dirname, themeDir + 'blocks/*/front.ts')).reduce((acc, path) => {
        const parts = path.split('/')
        const entry = 'front-js-' + parts[parts.length - 2]
        acc[entry] = path
        return acc
      }, {}),
      ...glob.sync(path.resolve(__dirname, themeDir + 'blocks/*/front.css')).reduce((acc, path) => {
        const parts = path.split('/')
        const entry = 'front-css-' + parts[parts.length - 2]
        acc[entry] = path
        return acc
      }, {})
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false // Otherwise prints legal/copyright comments
            }
          }
        })
      ]
    },
    plugins: plugins,
    watchOptions: {
      ignored: [themeDir + 'dist/**', 'node_modules/**']
    },
    module: {
      rules: [
        // All JS
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader'
            }
          ]
        },
        // All CSS
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  parser: 'postcss-syntax',
                  plugins: [
                    'postcss-import',
                    postcssPrepend(),
                    'postcss-easing-gradients',
                    'precss',
                    'postcss-hexrgba',
                    'cssnano'
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    output: {
      filename: '[name].[contenthash].min.js',
      path: path.resolve(__dirname, themeDir + 'dist'),
      clean: true
    }
  }
}
