import React from 'react';
import Header from './Header.jsx'
import Card from './Body.jsx';
import Footer from './Footer.jsx';
import contacts from '../contacts.js';



function App() {
  return <div>
    <div className="wrapper">
      <Header />
      <div className="container my-5">
        <div className="row justify-content-center">
          {contacts.map((contact, idx) =>
            <div className="col-md-4" key={idx}>
              <Card
                name={contact.name}
                tel={contact.tel}
                imgUrl={contact.imgUrl} />
            </div>
          )}

        </div>
      </div>
    </div>
    <Footer />
  </div>
}

export default App;