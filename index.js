let request = require('request');
let DomParser = require('dom-parser');
let parser = new DomParser();
//rent.591


async function query(url) {

    let response = '';

    await new Promise(function (resolve, reject) {
        request(url, function (error, r, body) {
            response = body
            resolve(body)
        });        
    });

    return response;

}

async function main() {

    let firstPageContent = await query('https://rent.591.com.tw/?kind=0&region=4&section=371');
    let dom = parser.parseFromString(firstPageContent);
    let pageNumber = dom.getElementsByClassName("pageNum-form");
    const finalPageIndex = pageNumber[pageNumber.length-1]
    const finalPageNumber = finalPageIndex.innerHTML;
    const totalRows = finalPageIndex.attributes[2].value;
    //console.log(totalRows)
    for (let currentPage of pageNumber) {
        //console.log(currentPage.attributes[2].value);
        //console.log(currentPage.innerHTML);
    }

    const rowNumber = 30;

    for(let currentPage=0;currentPage<rowNumber;currentPage++){
        let firstRow = rowNumber*currentPage;
        let currentPageContent = await query(`https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=0&searchtype=1&region=4&section=371&firstRow=${firstRow}&totalRows=${totalRows}`);
        let currentPageObject = JSON.parse(currentPageContent)
        let rentList = currentPageObject.data.data
        for(let rentData of rentList){
            
            let rentDetail = await query(`https://rent.591.com.tw/rent-detail-${rentData.id}.html`);

            let haveOneYear = rentDetail.indexOf(`<div class="one">最短租期</div><div class="two"><span>：</span><em title="一年">一年</em></div>`)
            
            //console.log(haveOneYear)

            if(haveOneYear===-1){
                console.log(`https://rent.591.com.tw/rent-detail-${rentData.id}.html`)
            }

            

            
        }
        //console.log(rentList)
    }


}

main()

