const got= require('got');
const cheerio = require('cheerio');

// https://etherscan.io/token/0xA8b919680258d369114910511cc87595aec0be6D

// got('https://etherscan.io/token/0xA8b919680258d369114910511cc87595aec0be6D', error)

// (async () => {
//     const response = await got('https://etherscan.io/token/0xA8b919680258d369114910511cc87595aec0be6D');

//     const $ = cheerio.load(response.body);
//     console.log(cheerio.load(response.body));
    // console.log($('#ContentPlaceHolder1_tr_tokenHolders'))
// 	try {
// // div id="ContentPlaceHolder1_tr_tokenHolders"
//         const holderContainer = $('#ContentPlaceHolder1_tr_tokenHolders')
//         console.log(holderContainer)
// 	} catch (error) {
// 		console.log(error.response.body);
// 		//=> 'Internal server error ...'
// 	}
// });

// got('https://etherscan.io/token/0xA8b919680258d369114910511cc87595aec0be6D', response =>{
//     const $ = cheerio.load(response);
//     const holderContainer = $('#ContentPlaceHolder1_tr_tokenHolders')
//     console.log(response)
// })

// (async () => {
// 	try {
// 		const response = await got('https://etherscan.io/token/0xA8b919680258d369114910511cc87595aec0be6D');
//         const $ = cheerio.load(response.body);
//         const holderDiv = $('#ContentPlaceHolder1_tr_tokenHolders');
//         console.log((holderDiv.find('.mr-3')).html().trim().split('<')[0])
// 	} catch (error) {
// 		console.log(error.response.body);
// 	}
// })();

got('https://etherscan.io/token/0xA8b919680258d369114910511cc87595aec0be6D')
.then((response) => {
    const $ = cheerio.load(response.body);
    const holderDiv = $('#ContentPlaceHolder1_tr_tokenHolders');
    console.log((holderDiv.find('.mr-3')).html().trim().split('<')[0])
})
.catch((error) => {
    debug(error);
    return Promise.reject(
        error.response && error.response.body ? error.response.body : error
    );
})