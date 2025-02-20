import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store.tsx'
import { PersistGate } from 'redux-persist/integration/react'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
    <App />
      </PersistGate>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
