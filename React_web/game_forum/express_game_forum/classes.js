
class Like {
    constructor(email, threadId = null, postId = null, type = "like") {
        this.email = email;
        this.threadId = threadId; // Associate with a thread if applicable
        this.postId = postId;     // Associate with a post if applicable
        this.type = type;         // 'like' or 'dislike'
    }
}


class Thread {
    constructor(id = 0, title = "none", genres = [], author = "none", created = new Date("2023-07-06T16:00:00.000Z"), likes = [], imgs = [], content = "none") {
        this.id = id;
        this.title = title;
        this.genres = genres;
        this.author = author;
        this.created = created;
        this.likes = likes;  // Array of Like instances
        this.imgs = imgs;    // Array of image URLs
        this.content = content;
    }

    addLike(email, type = "like") {
        const like = new Like(email, this.id, null, type);
        this.likes.push(like);
    }

    removeLike(email) {
        this.likes = this.likes.filter(like => like.email !== email || like.threadId !== this.id);
    }

    getTotalLikes() {
        return this.likes.filter(like => like.type === "like").length;
    }

    getTotalDislikes() {
        return this.likes.filter(like => like.type === "dislike").length;
    }

    getInfo() {
        return `Thread: ${this.title} by ${this.author} - Genre: ${this.genres} - Likes: ${this.getTotalLikes()}, Dislikes: ${this.getTotalDislikes()}`;
    }
}

class Post {
    constructor(id = 0, threadID = 0, author = "none", created = new Date("2023-07-06T16:00:00.000Z"), likes = [], imgs = [], content = "none") {
        this.id = id;
        this.threadID = threadID;
        this.author = author;
        this.created = created;
        this.likes = likes;  // Array of Like instances
        this.imgs = imgs;    // Array of image URLs
        this.content = content;
    }

    addLike(email, type = "like") {
        const like = new Like(email, null, this.id, type);
        this.likes.push(like);
    }

    removeLike(email) {
        this.likes = this.likes.filter(like => like.email !== email || like.postId !== this.id);
    }

    getTotalLikes() {
        return this.likes.filter(like => like.type === "like").length;
    }

    getTotalDislikes() {
        return this.likes.filter(like => like.type === "dislike").length;
    }

    getInfo() {
        return `Post by ${this.author} in Thread ID ${this.threadID} - Likes: ${this.getTotalLikes()}, Dislikes: ${this.getTotalDislikes()}`;
    }
}

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  
 

export {Like, Post, Thread, AppError}