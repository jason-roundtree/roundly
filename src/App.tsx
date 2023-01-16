import React from 'react'
import Router from './Router';
import { Header, Footer } from './layout'

function App() {
  return (
    <div className="App">
      <Header />
      <Router />
      <Footer />
    </div>
  );
}

export default App;
