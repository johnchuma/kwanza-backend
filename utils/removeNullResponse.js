const { monthsNames } = require("./constants");

const removeNullResponse = (data) => {
  keys = Object.keys(data.dataValues);
  values = Object.values(data.dataValues);
  const newData = {};
  for (let index = 0; index < keys.length; index++) {
    newData[keys[index]] = values[index] ?? 0;
  }
  return newData;
};
const handleNullResponse = (data) => {
  let newData = {};
  if (data == null) {
    for (let index = 0; index < monthsNames.length; index++) {
      newData[monthsNames[index]] = 0;
    }
  } else {
    newData = data;
  }
  return newData;
};

module.exports = { removeNullResponse, handleNullResponse };
