const puppeteer = require("puppeteer");
const fs = require("fs"); // required for file serving
const path = require("path");
const PDFDocument = require("pdfkit");

const sendPdf = (socket, browser, data) => {
  const doc = new PDFDocument({
    size: [612, 792],
    margin: 50,
  });
  const location = path.join(__dirname, "../pdfpreviews/output.pdf");
  try {
    fs.unlinkSync(location);
  } catch (err) {
    console.error(err);
  }
  const writeStream = fs.createWriteStream("./pdfpreviews/output.pdf");
  doc.pipe(writeStream);

  if(data.pages.summary){
    doc.image("./pdfpreviews/summary.png", {
      width: 512,
      align: "center",
    });
  }

  //Pareto
  if(data.pages.pareto){
    let height = 100;
    
    if(data.pages.summary){
      doc.addPage();
    }

    doc.fontSize(30).font("Helvetica-Bold").text(`Pareto`, {
      align: "center",
    });

    for (let table of data.paretoImages) {
      doc
        .fontSize(18)
        .font("Helvetica")
        .text(`Part no: ${table.noPart}`, { align: "center" })
        .image(table.image, {width: 512});

      doc.y += height;
    }
  }

  //Charts
  if(data.pages.charts){
    if(data.pages.summary || data.pages.pareto){
      doc.addPage();
    }

    doc.fontSize(30).font("Helvetica-Bold").text(`Charts`, {
      align: "center",
    });

    const width = 252;
    const height = 169;

    for (let table of data.chartsImages) {
      if (doc.x != 50) {
        doc.x = 50;
        doc.y += height;
      }
      if (doc.y > 700 - height) {
        doc.addPage();
      }

      doc
        .fontSize(18)
        .font("Helvetica")
        .text(`Part no: ${table.noPart}`, { align: "center" });

      for (let img of table.images) {
        if (doc.y > 742 - height) {
          doc.addPage();
        }

        doc.image(img, {
          width,
          height,
        });

        doc.x = (doc.x + width) % (2 * width);

        if (doc.x != 50) {
          doc.y -= height;
        }
      }

      doc.y += 30;
    }
  }
  doc.end();

  writeStream.on("finish", function () {
    console.log("pdf generated");

    console.log(`location ${location}`);
    fs.readFile(location, async (err, info) => {
      // console.log(info)
      socket.emit("pdf", { pdf: true, buffer: info });
      console.log("pdf file was sent");
      await browser.close();
      console.log("browser closed");
      // console.log("files erased")
    });
  });
};

const chartScreenshot = async (socket, data) => {
  try {
    let width = 1130;
    let height = 1600;

    let url = "dut_no=";
    for(let i of data.part_num){
      url += i + ',';
    }

    console.log("Pdf generation process initiated");
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      headless: true,
      defaultViewport: {
        width,
        height,
      },
    });

    console.log(`http://${socket.handshake.headers.host}/chartsjs?pdf=true&${data.visualizationQuery + url}`);

    const page = await browser.newPage();
    await page.goto(`http://${socket.handshake.headers.host}/login`, {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("form");
    await page.type('#username', 'coto-admin');
    await page.type('#password', 'password');
    await page.click('#submit');
    await page.waitForNavigation();

    // Charts
    if(data.pages.charts){
      await page.goto(`http://${socket.handshake.headers.host}/chartsjs?pdf=true&${data.visualizationQuery + url}`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector(".second-container");

      const values = await page.$$eval("#test-no-selecter > option", (options) =>
        options.map((op) => op.value)
      );

      data.chartsImages = [];

      for (let noPart of values) {
        await page.select("#test-no-selecter", noPart);

        let images = [];
        for (let i of data.tests) {
          let chart = await page.$(`#${i}-main-container`);
          images.push(await chart.screenshot());
        }
        data.chartsImages.push({ noPart, images });
      }
      console.log("Charts images generated");
    }

    // Pareto
    if(data.pages.pareto){
      await page.goto(`http://${socket.handshake.headers.host}/pareto?pdf=true&${url}`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector(".dataTables_wrapper");

      const values = await page.$$eval("#test-no-selecter > option", (options) =>
        options.map((op) => op.value)
      );
      
      data.paretoImages = [];

      for (let noPart of values) {
        await page.select("#test-no-selecter", noPart);
        let table = await page.$(`#content-table`);


        data.paretoImages.push({ noPart, image: await table.screenshot()});
      }
      console.log("Pareto images generated");
    }

    //Summary
    if(data.pages.summary){
      await page.goto(`http://${socket.handshake.headers.host}/summary?pdf=true&${url}`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector("#testDiv");
      await page.screenshot({
        path: "./pdfpreviews/summary.png",
        omitBackground: true,
        fullPage: true,
      });

      console.log("Summary image generated");
    }

    // sendPngImage(screenshotBuffer,socket,browser);
    sendPdf(socket, browser, data);
  }
  catch(err){
    console.log(err);
    socket.emit("error");
  }
};

exports.chartGenerator = chartScreenshot;
