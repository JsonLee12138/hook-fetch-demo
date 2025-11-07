import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { useHookFetch } from 'hook-fetch/react'
import { sseDemo } from './api'

function App() {
  const [data, setData] = useState([])

  const { stream, error, loading: isLoading, cancel } = useHookFetch({
    request: sseDemo
  })

  return (
    <>
      <div>
        {!isLoading && <button onClick={stream}>Get SSE Data</button>}
        {isLoading && <button onClick={cancel}>loading...</button>}
      </div>
    </>
  )
}

export default App
