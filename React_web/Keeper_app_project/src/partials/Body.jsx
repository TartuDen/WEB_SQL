import React from "react";

function Body(){
    return<main className="content">
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12 text-center">
          <h2>Main Content Goes Here</h2>
          <p>This is where you can add the main content of your landing page.</p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">

            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
}

export default Body;