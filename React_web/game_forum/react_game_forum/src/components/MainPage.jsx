import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <h2>Main Page</h2>
      <Link to="/threads">View Threads</Link>
    </div>
  );
};

export default MainPage;
