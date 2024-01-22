import React from 'react'

export default function PageContainer({ children }) {
  return (
    <div id="page-container" className="m-8 mx-auto max-w-screen-md">
      {children}
    </div>
  )
}
