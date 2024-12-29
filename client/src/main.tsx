import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { SignalRProvider } from './context/SignalRContext.tsx'

createRoot(document.getElementById('root')!).render(
  <SignalRProvider>
    <App />
    <Toaster className='z-99' closeButton />
  </SignalRProvider>,
)
