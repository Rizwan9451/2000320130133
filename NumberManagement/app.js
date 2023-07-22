const axios = require('axios');
const express = require('express');
const app = express();
const port = 4000;

app.use(express.json()); 

async function fetchNumbers(url) {
  try {
    const ans = await axios.get(url, { timeout: 500 });
    return ans.data.numbers || [];
  } catch (error) {
    return [];
  }
}
app.get('/NumberManagement', async (req, res) => {
  const urls = req.query.url;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid Input......' });
  }

  try {
    const numbers = await processUrls(urls);
    res.json({ numbers });
  } catch (error) {
    res.status(500).json({ error: 'Error Processing URLs.....' });
  }
});

async function processUrls(urls) {
  const promises = urls.map(fetchNumbers);
  const res = await Promise.all(promises);
  const un = Array.from(new Set(res.flat())).sort((a, b) => a - b);
  return un;
}


app.listen(port, () => {
  console.log(`Server is running on port check for port number ${port}`);
});
