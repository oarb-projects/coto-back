const filter = require("../queries/filter");
const DTO = require("../queries/DTO");

const convertQueryMiddle = async (req, res, next) => {
  console.log("converting");
  if (Object.keys(req.query).length !== 0) {
    console.log(`req.query exists, #params: ${Object.keys(req.query).length}`);
    const filterData = DTO.convertData(req.query);
    const resArr = await filter.getData(filterData);
    // console.log(resArr);
    res.locals.resArr = resArr;
  }
  next();
};
exports.convertQueryMiddle = convertQueryMiddle;
