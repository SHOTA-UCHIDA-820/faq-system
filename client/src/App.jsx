import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

function App() {
  const [categories, setCategories] = useState([])
  const [config, setConfig] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [openIds, setOpenIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 初回読み込み：カテゴリ一覧・問い合わせ先設定
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/categories`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/config`).then((res) => res.json()),
    ])
      .then(([categoriesData, configData]) => {
        setCategories(categoriesData)
        setConfig(configData)
      })
      .catch(() => {
        setError('カテゴリ・設定情報の取得に失敗しました。サーバーが起動しているか確認してください。')
      })
  }, [])

  // カテゴリ切り替え時にFAQ一覧を取得
  useEffect(() => {
    setLoading(true)
    setError(null)
    const query = currentCategory === 'all' ? '' : `?category=${encodeURIComponent(currentCategory)}`
    fetch(`${API_BASE_URL}/api/faqs${query}`)
      .then((res) => {
        if (!res.ok) throw new Error('FAQデータの取得に失敗しました')
        return res.json()
      })
      .then((data) => {
        setFaqs(data)
        setOpenIds(new Set())
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'FAQデータの取得に失敗しました。')
        setLoading(false)
      })
  }, [currentCategory])

  function toggleAccordion(id) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const resultLabel = currentCategory === 'all' ? '全' : `「${currentCategory}」`

  return (
    <div className="wf-wrapper">
      {/* ヘッダー */}
      <div className="wf-header">
        <div className="logo">社内FAQシステム</div>
        {config && (
          <div className="contact-info">
            <strong>お問い合わせ先（{config.contactDepartment}）</strong>
            {config.contactEmail}
          </div>
        )}
      </div>

      {/* ページタイトル */}
      <div className="wf-hero">
        <h1>よくある質問（FAQ）</h1>
        <p>カテゴリを選択して、知りたい情報を探せます</p>
      </div>

      {/* カテゴリフィルター */}
      <div className="wf-filter">
        <label>カテゴリ：</label>
        <button
          className={`wf-filter-btn ${currentCategory === 'all' ? 'active' : ''}`}
          onClick={() => setCurrentCategory('all')}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`wf-filter-btn ${currentCategory === cat ? 'active' : ''}`}
            onClick={() => setCurrentCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ一覧 */}
      <div className="wf-faq-list">
        {error && <p className="wf-error">{error}</p>}
        {!error && (
          <p className="wf-result-count">
            {loading ? '読み込み中…' : `${resultLabel} ${faqs.length} 件`}
          </p>
        )}
        {!loading && !error && faqs.length === 0 && (
          <p className="wf-empty">該当するFAQがありません。</p>
        )}
        {!loading &&
          !error &&
          faqs.map((faq) => {
            const isOpen = openIds.has(faq.id)
            return (
              <div className="wf-accordion" key={faq.id}>
                <div
                  className={`wf-accordion-header ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleAccordion(faq.id)}
                >
                  <span className="q-label">Q</span>
                  <span className="q-text">{faq.question}</span>
                  <span className="category-badge">{faq.category}</span>
                  <span className="toggle-icon">▾</span>
                </div>
                <div className={`wf-accordion-body ${isOpen ? 'open' : ''}`}>
                  <div className="a-label">▍回答</div>
                  <div className="a-text">{faq.answer}</div>
                  <div className="a-updated">最終更新日：{faq.updatedAt}</div>
                </div>
              </div>
            )
          })}
      </div>

      {/* 問い合わせ先 */}
      {config && (
        <div className="wf-contact">
          <h3>🔍 FAQで解決しなかった場合</h3>
          <p>下記の担当部署へお問い合わせください。</p>
          <div className="email">📧 {config.contactDepartment}：{config.contactEmail}</div>
        </div>
      )}

      {/* フッター */}
      <div className="wf-footer">© 2026 社内FAQシステム｜総務部</div>
    </div>
  )
}

export default App
