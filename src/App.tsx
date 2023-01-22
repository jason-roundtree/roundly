import React from 'react'
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
        </div>
    )
}

export default App
