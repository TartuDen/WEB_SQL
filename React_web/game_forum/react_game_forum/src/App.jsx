import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './components/MainPage';
import ThreadList from './components/ThreadList';
import ThreadDetail from './components/ThreadDetail';
import LoginPage from './components/LoginPage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" exact component={MainPage} />
        <Route path="/threads" component={ThreadList} />
        <Route path="/thread/:id" component={ThreadDetail} />
      </Switch>
    </Router>
  );
};

export default App;
