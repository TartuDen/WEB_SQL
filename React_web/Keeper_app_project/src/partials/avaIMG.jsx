
function Avatar(props){
    return <img src={props.imgUrl} alt="contact photo" className="avatar" />

}

function MyAva(props){
    return <img src={props.imgUrl} alt="contact photo" className="my_ava" />

}

export {Avatar, MyAva};