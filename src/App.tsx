import { useEffect, useRef, useState } from 'react'
import './App.css'
import { useHookFetch } from 'hook-fetch/react'
import { sseDemo } from './api'

interface SSEData {
  title: string
  title_url: string
  type: string
  user: string
  wiki: string
}
function App() {
  const [data, setData] = useState<SSEData[]>([])

  const { stream, loading: isLoading, cancel } = useHookFetch({
    request: sseDemo
  })

  const handleStream = async () => {
    for await (const chunk of stream()) {
      console.log('chunk', chunk)
      if(typeof chunk.result === 'object') {
        setData(prev => [...prev, chunk.result as SSEData])
      }
    }
  }

  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = listRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [data])

  return (
    <>
      <div className="sse-page">
        <div className="sse-container">
          <h1 className="sse-title">SSE 实时数据</h1>
          <p className="sse-subtitle">点击下方按钮开始接收数据，列表会自动滚动至最新。</p>

          <div ref={listRef} className="sse-list">
            {data.length === 0 && (
              <div className="sse-empty">
                暂无数据，点击下方按钮开始
              </div>
            )}
            <div className="sse-grid">
              {data.map((item, idx) => (
                <div key={idx} className="sse-card">
                  <div className="sse-card-header">
                    <span className="sse-index">#{idx + 1}</span>
                    <a
                      href={item.title_url}
                      target="_blank"
                      rel="noreferrer"
                      className="sse-link"
                    >
                      {item.title}
                    </a>
                  </div>
                  <div className="sse-meta">
                    <span className="sse-badge">类型: {item.type}</span>
                    <span className="sse-badge">用户: {item.user}</span>
                    <span className="sse-badge">Wiki: {item.wiki}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sse-floating-bar">
        {!isLoading && (
          <button
            onClick={handleStream}
            className="sse-btn sse-btn--primary"
          >
            Get SSE Data
          </button>
        )}
        {isLoading && (
          <button
            onClick={cancel}
            className="sse-btn sse-btn--secondary"
          >
            正在加载... 点击取消
          </button>
        )}
      </div>
    </>
  )
}

export default App
