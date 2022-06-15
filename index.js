#!/usr/bin/env node

/**
 * dau
 * Display Advertising Utils
 *
 * @author Alan Gabriel Dawidowicz <->
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const axios = require('axios');
const alert = require('cli-alerts');
const chalk = require('chalk');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	if (input.includes(`bannerToVideo`)) {
		alert({type: `warning`, msg: `Work in Progress!`, name: `bannerToVideo`});
		// https://github.com/workeffortwaste/gsap-video-export
	}



	if (input.includes(`compressImages`)) {
		alert({type: `warning`, msg: `Work in Progress!`, name: `compressImages`});
		// https://www.npmjs.com/package/compress-images
	}



	if (input.includes(`repos`)) {
		const displayBoilerplate = axios.get('https://raw.githubusercontent.com/mediamonks/generator-display-boilerplate/master/package.json')
		const displayDevServer = axios.get('https://raw.githubusercontent.com/mediamonks/display-dev-server/master/package.json')
		const displayTemple = axios.get('https://raw.githubusercontent.com/mediamonks/display-temple/master/package.json')
		const displayUpload = axios.get('https://raw.githubusercontent.com/mediamonks/display-upload/master/package.json')

		await axios.all([displayBoilerplate, displayDevServer, displayTemple, displayUpload]).then(axios.spread((...responses) => {
console.log(`
Display-Dev-Server: ${chalk.green(responses[1].data.version)}
Display-Temple: ${chalk.green(responses[2].data.version)}
Display-Upload: ${chalk.green(responses[3].data.version)}
Display-Boilerplate: ${chalk.green(responses[0].data.version)}
`);
			
			alert({type: `info`, msg: `Server ${responses[0].data.devDependencies['@mediamonks/display-dev-server']} and Temple ${responses[0].data.devDependencies['@mediamonks/display-temple']}`, name: `Display Boilerplate ${responses[0].data.version} use:`});

		})).catch(errors => {
			console.error(errors)
		})

	}

	debug && log(flags);
})();
