const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001
const DATA_DIR = path.join(__dirname, 'data')

app.use(cors())

function readJsonFile(filename) {
  const filePath = path.join(DATA_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

// GET /api/faqs?category=カテゴリ名
app.get('/api/faqs', (req, res) => {
  try {
    const faqs = readJsonFile('faq.json')
    const { category } = req.query
    const filtered =
      !category || category === 'all' ? faqs : faqs.filter((f) => f.category === category)
    res.json(filtered)
  } catch (err) {
    console.error('faq.json の読み込みに失敗しました:', err.message)
    res.status(500).json({
      error:
        'FAQデータの読み込みに失敗しました。faq.jsonの記載内容（カンマや引用符など）を確認してください。',
    })
  }
})

// GET /api/categories
app.get('/api/categories', (req, res) => {
  try {
    res.json(readJsonFile('categories.json'))
  } catch (err) {
    console.error('categories.json の読み込みに失敗しました:', err.message)
    res.status(500).json({ error: 'カテゴリデータの読み込みに失敗しました。' })
  }
})

// GET /api/config
app.get('/api/config', (req, res) => {
  try {
    res.json(readJsonFile('config.json'))
  } catch (err) {
    console.error('config.json の読み込みに失敗しました:', err.message)
    res.status(500).json({ error: '設定データの読み込みに失敗しました。' })
  }
})

// 本番用：client/dist の静的ファイルを配信
const CLIENT_DIST = path.join(__dirname, '../client/dist')
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST))
  app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`FAQ system API サーバーが起動しました: http://localhost:${PORT}`)
})
