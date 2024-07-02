class Thread {
    constructor(id, title, genre, author, created, likes, content) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.author = author;
        this.created = created;
        this.likes = likes;  // { like: Number, dislike: Number }
        this.content = content;
    }

    getInfo() {
        return `Thread: ${this.title} by ${this.author} - Genre: ${this.genre} - Likes: ${this.likes.like}, Dislikes: ${this.likes.dislike}`;
    }
}

class Post {
    constructor(id, threadID, author, created, likes, content) {
        this.id = id;
        this.threadID = threadID;
        this.author = author;
        this.created = created;
        this.likes = likes;  // { like: Number, dislike: Number }
        this.content = content;
    }

    getInfo() {
        return `Post by ${this.author} in Thread ID ${this.threadID} - Likes: ${this.likes.like}, Dislikes: ${this.likes.dislike}`;
    }
}

class Likes {
    constructor(like, dislike) {
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

export {Likes, Post, Thread}