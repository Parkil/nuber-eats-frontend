import React, {ReactElement} from 'react'
import {render} from '@testing-library/react'
import {BrowserRouter as Router} from "react-router-dom";

export const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <Router>
      {children}
    </Router>
  )
}

const customRender = (
  ui: ReactElement,
  options?: any,
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'
export {customRender as render}
