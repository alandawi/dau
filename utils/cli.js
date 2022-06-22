const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	assetType: {
		type: `string`,
		default: 'adwords',
		alias: `at`,
		desc: `Type of the asset ('adwords' or 'dcm') to validate.`
	}
};

const commands = {
	help: { desc: `Print help info` },
	qa: { desc: `Search for .zip files in a directory and return the result of banner validation` },
	repos: { desc: `Get the versions of all the repositories inside GitHub Media.Monks DisplayAd` },
	bannerToVideo: { desc: `Easily export GreenSock (GSAP) animation to video.` },
	compressImages: { desc: `Minify size your images. Image compression with extension: jpg/jpeg, svg, png, gif.` }
};

const helpText = meowHelp({
	name: `dau`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
