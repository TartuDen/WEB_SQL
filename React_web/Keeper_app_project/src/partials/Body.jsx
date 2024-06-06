import React from "react";
import {Avatar, MyAva} from "./avaIMG"

function Card(props) {
  return <main className="content">

          <div className="card">
            <div className="card-body text-center">
              <h5>Contact of {props.name}</h5>
              <p>Phone number: {props.tel}</p>
              <p>Profile photo:</p>
                <Avatar
                imgUrl={props.imgUrl} />
            </div>
          </div>

  </main>
}

export default Card;