const fs = require("fs");

function writeDataToFile(fileName, context) {
  fs.writeFileSync(fileName, JSON.stringify(context), "utf8", err => {

    if (err) {
      console.log(err);
    }
  });
}

module.exports = { writeDataToFile };