const convertData = (receivedData) => {
  let filterData = {};

  if(receivedData.date1 && receivedData.date2){
    filterData.date_time = `BETWEEN '${receivedData.date1}' AND '${receivedData.date2}'`;
  }
  if(receivedData.part_no){
    filterData.part_no = ` = '${receivedData.part_no}'`;
  }
  if(receivedData.plt){
    filterData.test_type = ` = '${receivedData.plt}'`;
  }
  if(receivedData.dut_no){
    receivedData.dut_no = receivedData.dut_no.replace(/^,/, "");
    receivedData.dut_no = receivedData.dut_no.replace(/,$/, "");
    
    filterData.dut_no = ` in (${receivedData.dut_no})`;
  }
  if(receivedData.application){
    filterData.test_type = ` = '${receivedData.application}'`;
  }

  return filterData;
};

exports.convertData = convertData;
