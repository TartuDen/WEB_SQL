import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import ThreadDetail from './components/ThreadDetail';
import ThreadList from './components/ThreadList';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/threads" element={<ThreadList />} />
            <Route path="/thread/:id" element={<ThreadDetail />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
