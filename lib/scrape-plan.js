const axios = require('axios');
const fs = require('fs');
const JSDOM = require('jsdom').JSDOM;

const options = {
  headers: {
    Cookie: '_ga=GA1.2.198646582.1523729613; hblid=LKcpk3Sriutg3vt35t19B0T07TEropJj; olfsk=olfsk1796343815292878; _gid=GA1.2.1687415039.1524019682; wcsid=f6pjOIH6MXRTcqFl5t19B0T07TEWCr63; _okdetect=%7B%22token%22%3A%2215240196818990%22%2C%22proto%22%3A%22https%3A%22%2C%22host%22%3A%22www.esv.org%22%7D; _ok=6833-117-10-1555; _okbk=cd5%3Davailable%2Ccd4%3Dtrue%2Cvi5%3D0%2Cvi4%3D1524019682129%2Cvi3%3Dactive%2Cvi2%3Dfalse%2Cvi1%3Dfalse%2Ccd8%3Dchat%2Ccd6%3D0%2Ccd3%3Dfalse%2Ccd2%3D0%2Ccd1%3D0%2C; csrftoken=hnjqoEj12KlJLm158oFCiRMHFYcpJEswjaWkzHDuNjQDbwju6TOTKuY5bFBWPPq9; sessionid=3kcr975ceaqghn2nk6ferhvgeiqb4ihg; _oklv=1524019763486%2Cf6pjOIH6MXRTcqFl5t19B0T07TEWCr63'
  }
}
const baseUrl = 'https://www.esv.org/partials/reading-plan/daily-light/'
const allPassages = {}
for (let i = 1; i <= 12; i += 1) {
  allPassages[i] = {}
}
const months = { 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7:31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }
const gets = Object.entries(months).reduce((reqs, [month, lastDay]) => {
  for (let d = 1; d <= lastDay; d += 1) {
    reqs.push(getter(month, `${d}`))
  }
  return reqs
}, [])
Promise.all(gets).then(() => {
  const output = JSON.stringify(allPassages, null, 2)
  fs.writeFile('assets/passages.json', output, 'utf8', () => {
    console.log('done')
  })
})

function getter(month, day) {
  let year
  if (month > 4) year = 2018
  else if (month < 4) year = 2019
  else if (day < 17) year = 2019
  else year = 2018
  return axios.get(`${baseUrl}${year}-${month.padStart(2, 0)}-${day.padStart(2, 0)}/`, options)
  .then((r) => {
    const { document } = (new JSDOM(r.data)).window
    const verseLists = document.querySelectorAll('[data-passage]')
    allPassages[month][day] = {
      morning: verseLists[0].textContent,
      evening: verseLists[1].textContent
    }
  })
  .catch((e) => {
    console.log(month, day, e);
  })
}

