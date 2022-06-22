// TODO: NEED TO RESOLVE A PROMISE TO INDEX.JS?

const axios = require('axios');
const chalk = require('chalk');
const alert = require('cli-alerts');

module.exports = async () => {
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
			
        alert({type: `info`, msg: `Display Boilerplate ${responses[0].data.version} use 'Server v${responses[0].data.devDependencies['@mediamonks/display-dev-server'].replace("^", '')}' and 'Temple v${responses[0].data.devDependencies['@mediamonks/display-temple'].replace("^", '')}'`});
    })).catch(errors => {
        console.error(errors)
        alert({type: `error`, msg: errors});
    })
};
