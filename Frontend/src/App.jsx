import { AuthProvider } from './Contexts/AuthContext';
import { AppRouter } from './Components/Router';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;