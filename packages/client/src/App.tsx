import './App.css'
import AppRouter from './router';
import { Toaster } from 'react-hot-toast';
import { Provider } from "react-redux";
import { persistor, store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
       <AuthProvider>
          <AppRouter />
       </AuthProvider>
      </PersistGate>
       <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  );
}
export default App
