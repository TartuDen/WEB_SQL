import React from 'react';
import Header from './Header.jsx'
import Body from './Body.jsx';
import Footer from './Footer.jsx';

function App(){
  return <div className="wrapper">
 <div className="wrapper">

<Header />

<Body />



    <footer className="footer text-center bg-light py-3">
      <div className="container">
        <p className="mb-0">&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  </div>
  </div>
}

export default App;