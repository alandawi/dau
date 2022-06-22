// Imports
const path = require("path");
const fs = require('fs');
//const { cwd } = require('node:process');
const { webkit } = require('playwright'); // Or 'chromium' or 'firefox'
const alert = require('cli-alerts');

module.exports = async (assetType) => {
    let bannersZipFiles = [];
    let validationResult = [];
    const directoryPath = path.join(__dirname, '../build'); // TODO: need to check the true dir
    const baseUrl = (type) => `https://h5validator.appspot.com/${type}/asset`; // adwords  or dcm

    // TODO: need to get the argument with the TYPE of the validation

    const createTable = async (data) => {
        var myTable = "<table width='100%' align='center' border='1' cellpadding='10'><tr><th>BANNER</th><th>WITH ERROR</th><th>UNDER 150KB</th><th>VALIDATION LINK</th></tr>";

        await data.forEach((value, i) => {
            myTable += `<tr>`;
            myTable += `<td>${value.name}</td>`;
            myTable += `<td style="background: ${(value.hasErrors) ? '#ff9898' : '#7effb2'};">${value.hasErrors}</td>`;
            myTable += `<td style="background: ${(!value.sizeUnder150KB) ? '#ff9898' : '#7effb2'};">${value.sizeUnder150KB}</td>`;
            myTable += `<td><a href='${value.previewUrl}' target='_blank'>${value.previewUrl}</a></td>`;
            myTable += `</tr>`;
        })
        
        myTable += "</table>";

        return myTable;
    }

    // Init
    const init = async () => {
        alert({type: `success`, msg: `.zip files found`});

        const browser = await webkit.launch({ ignoreHTTPSErrors: true, headless: false, args: ['--start-maximized'], slowMo: 250 });
        const context = await browser.newContext();
        const page = await context.newPage();
        const url = baseUrl(assetType); // TODO: NEED TO GRAB FROM THE PARAMETERS

        for (const [index, zipFile] of bannersZipFiles.entries()) {
            let hasErrors = false;
            let sizeUnder150KB = true;

            await page.goto(url);

            alert({type: `info`, msg: zipFile, name: `VALIDATING`});

            const [fileChooser] = await Promise.all([
                page.waitForEvent('filechooser'),
                page.locator('.upload-container button').click(),
            ]);
            await fileChooser.setFiles(`./build/${zipFile}`); // TODO: need to read the current directory

            await page.waitForTimeout(1000);
            
            await page.waitForSelector('.card-title');
            await page.waitForTimeout(6000);

            await page.waitForSelector('.card-title');

            try {
                await page.waitForSelector('.fail-more-details', { timeout: 3500 })
                hasErrors = true;
            } catch (error) {
            }

            // TODO check if url is the same, if is the default, is size is big
            if (page.url() === baseUrl('adwords') || page.url() === baseUrl('dcm')) {
                alert({type: `warning`, msg: `${zipFile} file over 150KB`});
                sizeUnder150KB = false;
            }

            validationResult.push({
                name: zipFile,
                previewUrl: page.url(),
                sizeUnder150KB: sizeUnder150KB,
                hasErrors: hasErrors 
            })

            await page.waitForTimeout(4000);

            alert({type: `info`, msg: `${zipFile}`, name: `[${index+1}/${bannersZipFiles.length}] READY`});
        };

        await browser.close();

        const htmlData = await createTable(validationResult)
        
        fs.writeFile('VALIDATION.html', htmlData, function async (err) {
            //console.log(__dirname)
            //console.log(`${cwd()}/FOLDER/`);
            if (err) alert({type: `error`, msg: err});
        })

        alert({type: `success`, msg: `Please check the result inside the 'validation.html' file in the same directory.`, name: `ALL DONE`});
    }

    const seachZips = async () => {
        return fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return alert({type: `error`, msg: `Unable to scan directory:`});
            } 

            files.forEach( (file) => {
                if (file.includes('.zip')) {
                    bannersZipFiles.push(file)
                }
            });
        });
    }

    await seachZips();
    await init();
};


