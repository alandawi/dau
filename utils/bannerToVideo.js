const { exec } = require("child_process");

module.exports = async (args) => {
    // Instructions: https://github.com/workeffortwaste/gsap-video-export

    const options = args.split(',');

    const ls = exec(`gsap-video-export https://codepen.io/cassie-codes/pen/RwGEewq -c --selector ${options[0]} --viewport ${options[1]} --output ${options[2]}`);

    ls.stdout.on("data", data => {
        console.log(data);
    });

    ls.stdout.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
};


