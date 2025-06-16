import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import RecordList from './components/RecordList'
import Record from './components/Record'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<RecordList />} />
          <Route path="create" element={<Record />} />
          <Route path="edit/:id" element={<Record />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)