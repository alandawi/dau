#!/usr/bin/env node

/**
 * dau
 * Display Advertising Utils
 *
 * @author Alan Gabriel Dawidowicz <->
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const crawlerValidation = require('./utils/crawlerValidation');
const getRepos = require('./utils/getRepos');
const log = require('./utils/log');
const alert = require('cli-alerts');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	if (input.includes(`qa`)) {
		await crawlerValidation()
	}

	if (input.includes(`bannerToVideo`)) {
		alert({type: `warning`, msg: `Work in Progress!`, name: `bannerToVideo`});
		// https://github.com/workeffortwaste/gsap-video-export
	}

	if (input.includes(`compressImages`)) {
		alert({type: `warning`, msg: `Work in Progress!`, name: `compressImages`});
		// https://www.npmjs.com/package/compress-images
	}

	if (input.includes(`repos`)) {
		await getRepos()
	}

	debug && log(flags);
})();
