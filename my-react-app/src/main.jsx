import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/poppins"; 
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import './index.css'
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    </Provider>

)
