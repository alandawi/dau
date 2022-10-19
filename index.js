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
const bannerToVideo = require('./utils/bannerToVideo');
const getRepos = require('./utils/getRepos');
const log = require('./utils/log');
const alert = require('cli-alerts');

const { exec, spawn } = require("child_process");
// const { readdir } = require('fs').promises;
// const { statSync } = require('fs');

const fs = require('fs/promises');



const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	if (input.includes(`qa`)) {
		await crawlerValidation(flags.assetType)
	}

	if (input.includes(`bannerToVideo`)) {
		await bannerToVideo(flags.videoOpts);
	}

	if (input.includes(`compressImages`)) {
		alert({type: `warning`, msg: `Work in Progress!`, name: `compressImages`});
		// https://www.npmjs.com/package/compress-images
	}

	if (input.includes(`repos`)) {
		await getRepos()
	}
	
	if (input.includes('cleanModules')) {
		exec("rimraf ./**/node_modules", (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}

			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}

			alert({type: `success`, msg: `Please check the size of your directory`, name: `ALL DONE`});
		});
	}

	debug && log(flags);
})();
