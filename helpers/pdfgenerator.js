const puppeteer = require("puppeteer");
const fs = require("fs"); // required for file serving
const path = require("path");
const PDFDocument = require("pdfkit");

const sendPngImage = (screenshotBuffer, socket, browser) => {
  const location = path.join(__dirname, "../pdfpreviews/summary.png");
  console.log(`location ${location}`);
  fs.readFile(location, async (err, screenshotBuffer) => {
    console.log(screenshotBuffer);
    socket.emit("image", { image: true, buffer: screenshotBuffer });
    console.log("image file was sent");
    await browser.close();
    console.log("browser closed");
  });
};

const sendPdf = (socket, browser, chartsImages) => {
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
  doc.image("./pdfpreviews/summary.png", {
    width: 512,
    align: "center",
  });

  doc.addPage().fontSize(30).font("Helvetica-Bold").text(`Charts`, {
    align: "center",
  });

  const width = 252;
  const height = 169;

  for (let table of chartsImages) {
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
  doc.end();

  writeStream.on("finish", function () {
    console.log("pdf generated");

    console.log(`location ${location}`);
    fs.readFile(location, async (err, data) => {
      // console.log(data)
      socket.emit("pdf", { pdf: true, buffer: data });
      console.log("pdf file was sent");
      await browser.close();
      console.log("browser closed");
      // console.log("files erased")
    });
  });
};

const chartScreenshot = async (socket, url) => {
  try {
    let width = 1130;
    let height = 1600;

    console.log("Pdf generation process initiated");
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width,
        height,
      },
    });

    const page = await browser.newPage();

    // Charts
    await page.goto(`http://${socket.handshake.headers.host}/chartsjs${url}&pdf=true`, {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector(".second-container");

    const values = await page.$$eval("#test-no-selecter > option", (options) =>
      options.map((op) => op.value)
    );
    const chartsContainers = await page.$$eval(
      ".second-container > div",
      (containters) => containters.map((cont) => cont.id)
    );

    let chartsImages = [];

    for (let noPart of values) {
      await page.select("#test-no-selecter", noPart);

      let images = [];
      for (let i of chartsContainers) {
        let chart = await page.$(`#${i}`);

        images.push(await chart.screenshot());
      }

      chartsImages.push({ noPart, images });
    }
    console.log("Charts images generated");

    //Summary
    await page.goto(`http://${socket.handshake.headers.host}/summary${url}&pdf=true`, {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("#testDiv");
    const screenshotBuffer = await page.screenshot({
      path: "./pdfpreviews/summary.png",
      omitBackground: true,
      fullPage: true,
    });

    console.log("Summary image generated");

    // sendPngImage(screenshotBuffer,socket,browser);
    sendPdf(socket, browser, chartsImages);
  }
  catch(err){
    console.log(err);
    socket.emit("error");
  }
};

exports.chartGenerator = chartScreenshot;
