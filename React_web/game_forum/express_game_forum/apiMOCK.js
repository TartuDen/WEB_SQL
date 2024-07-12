import { Post, Thread, Like } from "./classes.js";
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let users = [
    {
        id: "user1",
        name: "John Doe",
        email: "john@gamersforum.com",
    },
    {
        id: "user2",
        name: "Alex Smith",
        email: "alex@gamehub.com",
    },
    {
        id: "user3",
        name: "Lisa Brown",
        email: "lisa@gamecritic.com",
    },
    {
        id: "user4",
        name: "Chris Johnson",
        email: "chris@gamingworld.com",
    },
    {
        id: "user5",
        name: "Denver Thompson",
        email: "denver1033@gmail.com",
    },
    // Add more users as necessary
];

let threads = [
    {
        id: 0,
        title: "Lineage 2 - Classic Server Updates",
        genres: ["MMORPG"],
        author: "john@gamersforum.com",
        created: new Date("2023-06-10T14:48:00.000Z"),
        likes: [
            new Like("john@gamersforum.com", 0, null, "like"),
            new Like("alex@gamehub.com", 0, null, "like"),
            new Like("lisa@gamecritic.com", 0, null, "dislike"),
        ],
        imgs: [],
        content: "Lineage 2's classic server has recently received a major update, bringing new quests, improved graphics, and a more balanced PvP system. Veteran players are excited about the nostalgia trip, while new players are finding the game more accessible than ever. If you haven't checked it out yet, now is the perfect time to dive back into the world of Lineage 2."
    },
    {
        id: 1,
        title: "Throne and Liberty - Beta Test Feedback",
        genres: ["MMORPG", "Open World"],
        author: "alex@gamehub.com",
        created: new Date("2023-07-01T10:30:00.000Z"),
        likes: [
            new Like("chris@gamingworld.com", 1, null, "like"),
            new Like("denver1033@gmail.com", 1, null, "like"),
            new Like("john@gamersforum.com", 1, null, "like"),
            new Like("lisa@gamecritic.com", 1, null, "dislike"),
        ],
        imgs: [],
        content: "Having spent a week in the Throne and Liberty beta, I can confidently say it's one of the most promising MMORPGs on the horizon. The graphics are stunning, the combat is fluid, and the world-building is top-notch. The community feedback has been overwhelmingly positive, and the developers are actively working on addressing any issues. If you're a fan of the genre, this is definitely one to watch."
    },
    {
        id: 2,
        title: "World of Warcraft - Dragonflight Expansion Review",
        genres: ["MMORPG", "Open World"],
        author: "lisa@gamecritic.com",
        created: new Date("2023-06-20T08:45:00.000Z"),
        likes: [
            new Like("alex@gamehub.com", 2, null, "like"),
            new Like("john@gamersforum.com", 2, null, "like"),
            new Like("lisa@gamecritic.com", 2, null, "dislike"),
        ],
        imgs: [],
        content: "The latest World of Warcraft expansion, Dragonflight, brings a breath of fresh air to the game. With new zones to explore, a new class to master, and a host of quality-of-life improvements, Blizzard has managed to reignite the excitement among both new and returning players. The new dragon-riding mechanic is a particular highlight, adding a fun and dynamic way to traverse the game world."
    },
    {
        id: 3,
        title: "Tarisland - New MMORPG on the Block",
        genres: ["RPG", "Fantasy"],
        author: "chris@gamingworld.com",
        created: new Date("2023-07-05T17:20:00.000Z"),
        likes: [
            new Like("lisa@gamecritic.com", 3, null, "dislike"),
            new Like("john@gamersforum.com", 3, null, "dislike"),
            new Like("denver1033@gmail.com", 3, null, "dislike"),
        ],
        imgs: [],
        content: "Tarisland is a new MMORPG that's quickly gaining traction among gamers. Its unique art style, combined with innovative gameplay mechanics, sets it apart from other titles in the genre. Early players praise its engaging story and the depth of its crafting system. As more content is released, Tarisland has the potential to become a major player in the MMORPG space."
    },
    {
        id: 4,
        title: "TL - The MMORPG that I'm Waiting For",
        genres: ["MMORPG", "Open World"],
        author: "denver1033@gmail.com",
        created: new Date("2024-07-05T17:20:00.000Z"),
        likes: [
            new Like("denver1033@gmail.com", 4, null, "like"),
            new Like("alex@gamehub.com", 4, null, "like"),
            new Like("lisa@gamecritic.com", 4, null, "dislike"),
        ],
        imgs: [],
        content: "Throne and Liberty, often abbreviated as TL, is an upcoming MMORPG that has captured the attention and excitement of the gaming community."
    }
];

let posts = [
    {
        id: 0,
        threadID: 0,
        author: "yur@pan.com",
        created: new Date("2023-06-12T09:30:00.000Z"),
        likes: [
            new Like("alex@gamehub.com", null, 0, "like"),
            new Like("lisa@gamecritic.com", null, 0, "dislike"),
        ],
        imgs: [],
        content: "I'm really enjoying the recent updates to Lineage 2's classic server. The new quests are challenging and the improved graphics make the game feel fresh again. However, I'm still not convinced about the balance changes in PvP."
    },
    {
        id: 1,
        threadID: 1,
        author: "sam@beta.com",
        created: new Date("2023-07-02T11:15:00.000Z"),
        likes: [
            new Like("denver1033@gmail.com", null, 1, "like"),
            new Like("alex@gamehub.com", null, 1, "like"),
            new Like("lisa@gamecritic.com", null, 1, "dislike"),
        ],
        imgs: [],
        content: "Throne and Liberty's beta has exceeded my expectations. The world is incredibly immersive and the combat system is so smooth. Can't wait to see what the final release has in store!"
    },
    {
        id: 2,
        threadID: 2,
        author: "jane@wowfan.com",
        created: new Date("2023-06-21T13:45:00.000Z"),
        likes: [
            new Like("alex@gamehub.com", null, 2, "like"),
            new Like("john@gamersforum.com", null, 2, "like"),
        ],
        imgs: [],
        content: "Dragonflight is exactly what World of Warcraft needed. The new zones are stunning, and I love the dragon-riding feature. It's brought a lot of fun back into the game for me."
    },
    {
        id: 3,
        threadID: 3,
        author: "mike@tarisland.com",
        created: new Date("2023-07-06T16:00:00.000Z"),
        likes: [
            new Like("lisa@gamecritic.com", null, 3, "like"),
            new Like("john@gamersforum.com", null, 3, "dislike"),
            new Like("denver1033@gmail.com", null, 3, "dislike"),
        ],
        imgs: [],
        content: "Tarisland is a breath of fresh air in the MMORPG genre. The art style is unique and the crafting system is really deep. There are still some bugs, but the potential is definitely there."
    }
];

// Simulate fetching threads from the database
async function fetchThreads() {
    await delay(1000); // Simulate a 1 second delay
    return threads;
}

// Simulate fetching posts for a specific thread from the database
async function fetchPostsByThreadID(threadID) {
    await delay(1000); // Simulate a 1 second delay
    return posts.filter(post => post.threadID === threadID);
}

async function fetchUser(email) {
    await delay(1000);
    return users.find(user => user.email === email);
}
export { fetchThreads, fetchPostsByThreadID, fetchUser };
