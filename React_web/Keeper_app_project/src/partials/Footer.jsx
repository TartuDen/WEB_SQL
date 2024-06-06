import React from "react";
import { Avatar } from "./avaIMG";
import contacts from "../contacts";

function Footer({ friendsList }) {
    return (
        <div>
            <footer className="footer text-center bg-light py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                    <div className="friends-images">
                        {friendsList.map((name, index) => {
                            const friend = contacts.find(contact => contact.name === name);
                            return friend ? (
                                <Avatar
                                    key={index}
                                    imgUrl={friend.imgUrl}
                                />
                            ) : null;
                        })}
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
