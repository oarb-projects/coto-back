const puppeteer = require('puppeteer');
const fs = require('fs'); // required for file serving
const path = require('path');
const PDFDocument = require('pdfkit');

const sendPngImage=(screenshotBuffer,socket,browser)=>{
    const location=path.join(__dirname, '../pdfpreviews/summary.png');
    console.log(`location ${location}`)
    fs.readFile(location, async (err, screenshotBuffer)=>{
        console.log(screenshotBuffer)
        socket.emit('image', { image: true, buffer: screenshotBuffer });
        console.log('image file was sent');
        await browser.close();
        console.log('browser closed')
    })
}

const sendPdf=(socket,browser)=>{
    const doc = new PDFDocument({
        size:[1500,1500]
    })
    const location=path.join(__dirname, '../pdfpreviews/output.pdf');
    try {
        fs.unlinkSync(location)
        //file removed
      } catch(err) {
        console.error(err)
    }
    const writeStream = fs.createWriteStream('./pdfpreviews/output.pdf');
    doc.pipe(writeStream)
    doc.image('./pdfpreviews/summary.png', {
        // fit: [500, 400],
        width:1500,
        align: 'center',
        valign: 'center'
     });
    doc.addPage()
    .image('./pdfpreviews/charts.png', {
        // fit: [500,400],
        align: 'center',
        valign: 'center'
    });
    doc.end()
    writeStream.on('finish', function () {
        console.log("pdf generated")

        console.log(`location ${location}`)
        fs.readFile(location, async (err, data)=>{
            // console.log(data)
            socket.emit('pdf', { pdf: true, buffer: data });
            console.log('pdf file was sent');
            await browser.close();
            console.log('browser closed')
            // console.log("files erased")
        })
    })
  
}

const  chartScreenshot = async (width,height,socket) =>{
    const returnPageOptions=(x,y,width,height,path)=>{
        return {
            path,
            omitBackground:true,
            clip:{x,y,width,height}
        }
    }
    console.log("Pdf generation process initiated")

    // headless false for debugging
    const browserOptions={
        headless:true,
        defaultViewport:{
            width,
            height
        }
    }
    const browser = await puppeteer.launch(browserOptions);

    const page = await browser.newPage();
    // wait until every network connection is over (network idle 0)
    await page.goto('http://localhost:3000/chartsjs',{"waitUntil" : "networkidle0"});
    await page.waitForSelector('.second-container')
    await page.evaluate(() => {
        document.querySelector(".second-container").style="background-color:white"
    });
    const options=returnPageOptions(40,200,1400,1330,'./pdfpreviews/charts.png')
    await page.screenshot(options);
    console.log("Charts image generated")
    
    const options2=returnPageOptions(0,260,1400,840,'./pdfpreviews/summary.png')
    await page.goto('http://localhost:3000/summary',{"waitUntil" : "networkidle0"});
    const screenshotBuffer=await page.screenshot(options2);
    console.log("Summary image generated")
 
    // sendPngImage(screenshotBuffer,socket,browser);
    sendPdf(socket,browser);
};

exports.chartGenerator=chartScreenshot;