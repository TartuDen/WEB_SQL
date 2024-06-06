class User {
  constructor(name, tel, imgUrl, friends = []) {
    this.name = name;
    this.tel = tel;
    this.imgUrl = imgUrl;
    this.friends = friends;
  }
}


let contacts = [
    new User (
      "Den",
      "555-55-5",
      "https://cdn-icons-png.flaticon.com/512/2835/2835068.png",
      ["Yurec","Ihor"]
    ),
    new User(
      "Yurec",
      "654-77-5",
      "https://i.etsystatic.com/28793548/r/il/504a24/2991756696/il_fullxfull.2991756696_9xv3.jpg",
      ["Den", "Ihor"]
    ),
    new User (
      "Ihor",
      "789-54-21",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBx7Aj9ePTZZr_TrooFCF9ymY6kWUJ2hcGcA&s",
      ["Den", "Yurec"]
    ),
  ]

  export default contacts;