import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import ThreadDetail from './components/ThreadDetail';
import ThreadList from './components/ThreadList';
import LoginPage from './components/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/threads" element={<ThreadList />} />
        <Route path="/thread/:id" element={<ThreadDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
