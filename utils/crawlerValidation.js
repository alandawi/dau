// Imports
const fs = require('fs');
const { cwd } = require('node:process');
const { webkit } = require('playwright'); // Or 'chromium' or 'firefox'
const alert = require('cli-alerts');

module.exports = async (assetType) => {
    let bannersZipFiles = [];
    let validationResult = [];
    const baseUrl = (type) => `https://h5validator.appspot.com/${type}/asset`;

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
        const url = baseUrl(assetType);

        for (const [index, zipFile] of bannersZipFiles.entries()) {
            let hasErrors = false;
            let sizeUnder150KB = true;

            await page.goto(url);

            alert({type: `info`, msg: zipFile, name: `VALIDATING`});

            const [fileChooser] = await Promise.all([
                page.waitForEvent('filechooser'),
                page.locator('.upload-container button').click(),
            ]);
            await fileChooser.setFiles(`./${zipFile}`); // TODO: need to read the current directory

            await page.waitForTimeout(1000);
            
            await page.waitForSelector('.card-title');
            await page.waitForTimeout(6000);

            // await page.waitForSelector('.card-title', { timeout: 5000 }); // Need?

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
            if (err) alert({type: `error`, msg: err});
        })

        // TODO: Add total time
        alert({type: `success`, msg: `Please check the result inside the 'validation.html' file in the same directory.`, name: `ALL DONE`});
    }

    const seachZips = async () => {
        return fs.readdir(cwd(), (err, files) => {
            if (err) {
                return alert({type: `error`, msg: `Unable to scan directory:`});
            }

            // TODO: validate .zip or show the error

            files.forEach( (file) => {
                if (file.includes('.zip')) {
                    bannersZipFiles.push(file)
                }
            });
        });
    }

    await seachZips();

    // TODO: init only if there are .zip files
    await init();
};


