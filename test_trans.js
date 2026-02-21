const https = require('https');
function translateText(text) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let result = '';
          if (json && json[0]) {
             json[0].forEach(item => { if (item[0]) result += item[0]; });
          }
          resolve(result);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}
translateText("大叔是谁？").then(console.log).catch(console.error);
