import './App.css'
import AppRouter from './router';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
export default App
