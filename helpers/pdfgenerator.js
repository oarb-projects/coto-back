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

const sendPdf = (socket, browser) => {
  const doc = new PDFDocument({
    size: [1260, 1635],
  });
  const location = path.join(__dirname, "../pdfpreviews/output.pdf");
  try {
    fs.unlinkSync(location);
    //file removed
  } catch (err) {
    console.error(err);
  }
  const writeStream = fs.createWriteStream("./pdfpreviews/output.pdf");
  doc.pipe(writeStream);
  doc.image("./pdfpreviews/summary.png", {
    // fit: [500, 400],
    width: 1130,
    align: "center",
    valign: "center",
  });
  doc.addPage().image("./pdfpreviews/charts.png", {
    // fit: [500,400],
    align: "center",
    valign: "center",
  });
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

  // wait until every network connection is over (network idle 0)
  await page.goto(
    `http://localhost:8080/chartsjs${url}&pdf=true`,
    { waitUntil: "networkidle0" }
  );
  await page.waitForSelector(".second-container");

  await page.screenshot({
    path: "./pdfpreviews/charts.png",
    omitBackground: true,
    fullPage: true
  });
  console.log("Charts image generated");


  await page.goto(
    `http://localhost:8080/summary${url}&pdf=true`,
    { waitUntil: "networkidle0" }
  );
  await page.waitForSelector("#testDiv");
  const screenshotBuffer = await page.screenshot({
    path: "./pdfpreviews/summary.png",
    omitBackground: true,
    fullPage: true
  });
  console.log("Summary image generated");

  // sendPngImage(screenshotBuffer,socket,browser);
  sendPdf(socket, browser);
};

exports.chartGenerator = chartScreenshot;
