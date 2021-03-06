// eslint-disable-next-line
require('dotenv').config()
// eslint-disable-next-line
const nodeExternals = require('webpack-node-externals')

// eslint-disable-next-line
module.exports = {
    // eslint-disable-next-line
    srcDir: __dirname,
    env: {
        apiUrl: process.env.APP_URL || 'http://api.laravel-nuxt.test',
        appName: process.env.APP_NAME || 'Laravel-Nuxt',
        appLocale: process.env.APP_LOCALE || 'en',
        githubAuth: !!process.env.GITHUB_CLIENT_ID
    },

    head: {
        title: process.env.APP_NAME,
        titleTemplate: '%s - ' + process.env.APP_NAME,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Vuetified Nuxt' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
        // script: [ //! Add External Scripts Here
        // ]
    },

    loading: { color: process.env.LOADING_COLOR || '#B9F6CA' },

    router: {
        middleware: ['locale', 'check-auth']
    },

    css: [
        { src: 'roboto-base64', lang: 'css' },
        { src: '~assets/style/app.styl', lang: 'stylus' },
        { src: '~assets/sass/app.scss', lang: 'scss' }
    ],

    plugins: [
    // '~components/global',
        '~/plugins/i18n',
        '~/plugins/axios',
        '~/plugins/fontawesome',
        '~/plugins/vform',
        '~/plugins/vuetify'
    // '~plugins/nuxt-client-init', //! UNCOMMENT FOR SPA MODE ONLY
    ],

    modules: [
        '@nuxtjs/router',
        '@nuxtjs/apollo',
        [
            'nuxt-env', {
                keys: [
                    'API_URL', 'APP_NAME', 'APP_URL', 'APP_LOCALE', 'APP_TRADEMARK',
                    'SITE_ADDRESS', 'SITE_CITY', 'SITE_STATE', 'SITE_CONTACT_NO', 'SITE_COUNTRY', 'SITE_EMAIL'
                ]
            }
        ]
    ],
    apollo: {
        clientConfigs: {
            default: '~/apollo/client-configs/default.js'
        }
    },
    build: {
        babel: {
            plugins: [
                ['transform-imports', {
                    'vuetify': {
                        'transform': 'vuetify/es5/components/${member}',
                        'preventFullImport': true
                    }
                }]
            ]
        },
        //! This Will Export The Script in A Vendor.js */
        vendor: [
            '~/plugins/vuetify.js'
        ],
        extractCSS: true,
        /*
    ** Run ESLint on save
    */
        extend (config, { isDev, isClient, isServer }) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
            if (isServer) {
                //! Externalize app dependencies. This makes the server build much faster
                //! and generates a smaller bundle file. -> /\.css$/
                config.externals = [
                    nodeExternals({
                        //! this will be included in the bundle
                        //! needed since we use ala carte in vuetify
                        whitelist: [/^vuetify/]
                    })
                ]
            }
            //! add All Your webpack Aliases here
            config.resolve.alias['@fortawesome/fontawesome-free-solid$'] = '@fortawesome/fontawesome-free-solid/shakable.es.js'
        },
        filenames: {
            css: 'common.[contenthash].css',
            manifest: 'manifest.[hash].js',
            vendor: 'common.[chunkhash].js',
            app: 'app.[chunkhash].js',
            chunk: '[name].[chunkhash].js'
        }
    }
}
