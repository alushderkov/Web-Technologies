function getPostData(req) {
  return new Promise(function (resolve, reject) {

    try {
      let body = ``;
      req
        .on('data', chunk => {
          body += chunk.toString();
        })
        .on('end', () => {
          resolve(body);
        });

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { getPostData };