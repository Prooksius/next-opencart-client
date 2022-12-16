const withTM = require('next-transpile-modules')(['gsap'])

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: ['next-cart.site'],
	},
	i18n: {
		locales: ['en', 'ru'],
		defaultLocale: 'ru',
	},
}

module.exports = withTM(nextConfig)
