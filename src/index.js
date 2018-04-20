const api = require('./esv-api')
const hermit = require('hermit')
const passages = require('../assets/passages.json')

const d = new Date()
const month = d.getMonth() + 1
const day = d.getDate()
api.text(passages[month][day].morning)
  .then((r) => {
    console.log('MORNING')
    console.log('-------')
    r.data.passages.forEach(p => console.log(p))
    api.text(passages[month][day].evening)
      .then((r) => {
        console.log('\n\n\nEVENING')
        console.log('-------')
        r.data.passages.forEach(p => console.log(p))
      })
  })
