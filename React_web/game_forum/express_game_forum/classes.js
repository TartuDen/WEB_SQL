class Likes {
    constructor(like=0, dislike=0) {
        this.like = like;
        this.dislike = dislike;
    }

    getTotal() {
        return this.like - this.dislike;
    }

    getInfo() {
        return `Likes: ${this.like}, Dislikes: ${this.dislike}`;
    }
}

class Thread {
    constructor(id=0, title="none", genre="none", author="none", created=new Date("2023-07-06T16:00:00.000Z"), likes=new Likes(), imgs=[], content="none") {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.author = author;
        this.created = created;
        this.likes = likes;  // Instance of Likes class
        this.imgs = imgs;    // Array of image URLs
        this.content = content;
    }

    getInfo() {
        return `Thread: ${this.title} by ${this.author} - Genre: ${this.genre} - ${this.likes.getInfo()}`;
    }
}

class Post {
    constructor(id=0, threadID=0, author="none", created=new Date("2023-07-06T16:00:00.000Z"), likes=new Likes(), imgs=[], content="none") {
        this.id = id;
        this.threadID = threadID;
        this.author = author;
        this.created = created;
        this.likes = likes;  // Instance of Likes class
        this.imgs = imgs;    // Array of image URLs
        this.content = content;
    }

    getInfo() {
        return `Post by ${this.author} in Thread ID ${this.threadID} - ${this.likes.getInfo()}`;
    }
}

export {Likes, Post, Thread}