import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Table } from './components/Table.tsx'
import "primereact/resources/themes/lara-light-indigo/theme.css"  // Theme
import "primereact/resources/primereact.min.css"                  // Core style
import './index.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Table/>
  </StrictMode>,
)
