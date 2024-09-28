import React from 'react'
import ToastPortal from './components/shared/components/ToastPortal'
import 'react-toastify/dist/ReactToastify.css'

import Router from './Router'
import { Header, Footer, PageContainer } from './layout'

function App() {
  return (
    <div className="App">
      <Header />
      <PageContainer>
        <Router />
      </PageContainer>
      <Footer />
      <ToastPortal />
    </div>
  )
}

export default App
