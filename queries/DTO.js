const convertData = (receivedData) => {
  const filterData = {
    date_time: ` BETWEEN '${receivedData.date1}' AND '${receivedData.date2}' `,
    part_no: receivedData.part_no != "" ? ` = '${receivedData.part_no}'` : "",
    plt: receivedData.plt != "" ? ` = '${receivedData.plt}'` : "",
    test_type:
      receivedData.application != "" ? ` = '${receivedData.application}'` : "",
  };
  return filterData;
};

exports.convertData = convertData;
