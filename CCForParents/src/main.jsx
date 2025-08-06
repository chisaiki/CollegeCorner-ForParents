import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from './App.jsx'

/*My custom pages*/
import Layout from './components/Layout'
import Resources from './components/Resources.jsx'
import FAQ from './components/FAQ.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Home from './components/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Router wraps entire app - main.jsx is entry point, replaced <App /> with routing structure */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/*index means this is the default route for "/"*/}
          <Route index element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<ErrorPage />} />  {/* Catch-all route */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
