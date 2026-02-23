import React from 'react'
import ReactDOM from 'react-dom/client'
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import App from './App'
import './index.css'

const tg = (window as any).Telegram?.WebApp;
tg?.expand?.();
tg?.disableVerticalSwipes?.();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <App />
    </DndProvider>
  </React.StrictMode>
)
