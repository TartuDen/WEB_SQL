import React from "react";
import {MyAva} from "./avaIMG";

function Header(){
    return <div>
        <header className="bg-primary text-white text-center py-3">
            <h1>Welcome my contacts:</h1>
            <MyAva
            imgUrl="https://img.freepik.com/premium-vector/old-mage-icon-sports-esports-wizard-head-mascot-emblem_950157-3710.jpg" />
        </header>
    </div>
}

export default Header;