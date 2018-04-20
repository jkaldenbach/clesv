const axios = require('axios');
const apiKey = require('../env.json').ESV_API_KEY;

const api = function() {
  const client = axios.create({
    baseURL: 'https://api.esv.org/v3/passage',
    headers: { Authorization: `Token ${apiKey}` }
  })

  const html = async function(q) {
    try {
      return await client.get('/html', { params: { q } })
    } catch (e) {
      return e
    }
  }

  const text = async function(q) {
    try {
      return await client.get('/text', { params: { q } })
    } catch (e) {
      return e
    }
  }

  return { html, text }
}

module.exports = api();
