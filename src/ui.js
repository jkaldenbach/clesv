const api = require('./esv-api')
const blessed = require('blessed')
const daily = require('../assets/passages.json')

const screen = blessed.screen({
  smartCSR: true
})

screen.title = 'CLISV'

const layout = blessed.layout({
  parent: screen,
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
})

const contentarea = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: '100%-2',
  border: { type: 'line' },
  style: {
    border: { fg: '#f0f0f0' }
  }
})

const emptyview = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  tags: true,
  content: `{center}
Welcome to CLISV

P: Passage Lookup
D: Daily Light on the Daily Path
Q: Quit
{/}`,
  style: { align: 'center' }
})

const passage = blessed.box({
  top: '0',
  left: '0',
  width: '100%-2',
  height: '100%-2',
  scrollable: true,
  scrollbar: {
    ch: ' ',
    inverse: true
  },
  alwaysScroll: true,
  mouse: true,
  keys: true,
  input: true,
  vi: true
})

const help = blessed.text({
  top: '100%-2',
  left: 'center',
  width: '100%',
  content: 'P: Passage  D: Daily  Q: Quit'
})

const form = blessed.form({
  top: '100%-1',
  left: '0',
  width: '100%',
  keys: true
})
const input = blessed.textbox({
  bottom: '0',
  left: '0',
  width: '100%',
  height: '1',
  inputOnFocus: true,
  content: 'anything',
  keys: true,
  style: { fg: 'white' }
})
input.on('submit', async (value) => {
  input.clearValue()
  screen.render()
  const resp = await api.text(value)
  const text = resp.data.passages.reduce((t, p) => `${t}${p}`, '')
  renderPassage(text)
})

contentarea.append(emptyview)
layout.append(contentarea)
layout.append(help)
layout.append(input)
screen.append(layout)

screen.key(['q', 'C-c'], (ch, key) => {
  return process.exit(0)
})
screen.key('p', (ch, key) => {
  input.focus()
})
screen.key('d', async (ch, key) => {
  const n = new Date()
  const m = n.getMonth() + 1
  const d = n.getDate()
  const mResp = await api.text(daily[m][d].morning)
  const eResp = await api.text(daily[m][d].evening)
  const mText = mResp.data.passages.reduce((t, p) => `${t}${p}`, '')
  const eText = eResp.data.passages.reduce((t, p) => `${t}${p}`, '')
  const text = `MORNING\n${mText}\n\n\nEVENING\n${eText}`
  renderPassage(text)
})

screen.render()

function renderPassage(text) {
  contentarea.remove(emptyview)
  contentarea.append(passage)
  passage.setContent(text)
  screen.render()
  passage.focus()
  passage.enableInput()
}
