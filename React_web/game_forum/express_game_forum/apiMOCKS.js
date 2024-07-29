import { Post, Thread, Like } from "./classes.js";

let users = [
    {
        id: 1,
        name: "John Doe",
        email: "john@gamersforum.com",
        ava: null,
    },
    {
        id: 2,
        name: "Alex Smith",
        email: "alex@gamehub.com",
        ava: null,
    },
    {
        id: 3,
        name: "Lisa Brown",
        email: "lisa@gamecritic.com",
        ava: null,
    },
    {
        id: 4,
        name: "Chris Johnson",
        email: "chris@gamingworld.com",
        ava: null,
    },
    {
        id: 5,
        name: "Denver Thompson",
        email: "denver1033@gmail.com",
        ava: null,
    },
    // Add more users as necessary
];

let threads = [
    {
        id: 1,
        title: "Lineage 2 - Classic Server Updates",
        genres: ["MMORPG"],
        author: 1,
        created: new Date("2023-06-10T14:48:00.000Z"),
        imgs: [],
        content: "Lineage 2's classic server has recently received a major update, bringing new quests, improved graphics, and a more balanced PvP system. Veteran players are excited about the nostalgia trip, while new players are finding the game more accessible than ever. If you haven't checked it out yet, now is the perfect time to dive back into the world of Lineage 2."
    },
    {
        id: 2,
        title: "Throne and Liberty - Beta Test Feedback",
        genres: ["MMORPG", "Open World"],
        author: 2,
        created: new Date("2023-07-01T10:30:00.000Z"),
        imgs: [],
        content: "Having spent a week in the Throne and Liberty beta, I can confidently say it's one of the most promising MMORPGs on the horizon. The graphics are stunning, the combat is fluid, and the world-building is top-notch. The community feedback has been overwhelmingly positive, and the developers are actively working on addressing any issues. If you're a fan of the genre, this is definitely one to watch."
    },
    {
        id: 3,
        title: "World of Warcraft - Dragonflight Expansion Review",
        genres: ["MMORPG", "Open World"],
        author: 3,
        created: new Date("2023-06-20T08:45:00.000Z"),
        imgs: [],
        content: "The latest World of Warcraft expansion, Dragonflight, brings a breath of fresh air to the game. With new zones to explore, a new class to master, and a host of quality-of-life improvements, Blizzard has managed to reignite the excitement among both new and returning players. The new dragon-riding mechanic is a particular highlight, adding a fun and dynamic way to traverse the game world."
    },
    {
        id: 4,
        title: "Tarisland - New MMORPG on the Block",
        genres: ["RPG", "Fantasy"],
        author: 4,
        created: new Date("2023-07-05T17:20:00.000Z"),
        imgs: [],
        content: "Tarisland is a new MMORPG that's quickly gaining traction among gamers. Its unique art style, combined with innovative gameplay mechanics, sets it apart from other titles in the genre. Early players praise its engaging story and the depth of its crafting system. As more content is released, Tarisland has the potential to become a major player in the MMORPG space."
    },
    {
        id: 5,
        title: "TL - The MMORPG that I'm Waiting For",
        genres: ["MMORPG", "Open World"],
        author: 5,
        created: new Date("2024-07-05T17:20:00.000Z"),
        imgs: [],
        content: "Throne and Liberty, often abbreviated as TL, is an upcoming MMORPG that has captured the attention and excitement of the gaming community."
    }
];

let posts = [
    {
        id: 1,
        threadID: 1,
        author: 2,
        created: new Date("2023-06-12T09:30:00.000Z"),
        imgs: [],
        content: "I'm really enjoying the recent updates to Lineage 2's classic server. The new quests are challenging and the improved graphics make the game feel fresh again. However, I'm still not convinced about the balance changes in PvP."
    },
    {
        id: 2,
        threadID: 2,
        author: 3,
        created: new Date("2023-07-02T11:15:00.000Z"),
        imgs: [],
        content: "Throne and Liberty's beta has exceeded my expectations. The world is incredibly immersive and the combat system is so smooth. Can't wait to see what the final release has in store!"
    },
    {
        id: 3,
        threadID: 3,
        author: 1,
        created: new Date("2023-06-21T13:45:00.000Z"),
        imgs: [],
        content: "Dragonflight is exactly what World of Warcraft needed. The new zones are stunning, and I love the dragon-riding feature. It's brought a lot of fun back into the game for me."
    },
    {
        id: 4,
        threadID: 4,
        author: 1,
        created: new Date("2023-07-06T16:00:00.000Z"),
        imgs: [],
        content: "Tarisland is a breath of fresh air in the MMORPG genre. The art style is unique and the crafting system is really deep. There are still some bugs, but the potential is definitely there."
    }
];

let likes = [
    // Likes for threads
    new Like(1, 1, null, "like"),
    new Like(2, 1, null, "like"),
    new Like(3, 1, null, "dislike"),
    new Like(4, 2, null, "like"),
    new Like(5, 2, null, "like"),
    new Like(1, 2, null, "like"),
    new Like(3, 2, null, "dislike"),
    new Like(2, 3, null, "like"),
    new Like(1, 3, null, "like"),
    new Like(3, 3, null, "dislike"),
    new Like(3, 4, null, "dislike"),
    new Like(1, 4, null, "dislike"),
    new Like(5, 4, null, "dislike"),
    new Like(5, 5, null, "like"),
    new Like(2, 5, null, "like"),
    new Like(3, 5, null, "dislike"),

    // Likes for posts
    new Like(2, null, 1, "like"),
    new Like(3, null, 1, "dislike"),
    new Like(5, null, 2, "like"),
    new Like(2, null, 2, "like"),
    new Like(3, null, 2, "dislike"),
    new Like(2, null, 3, "like"),
    new Like(1, null, 3, "like"),
    new Like(3, null, 4, "like"),
    new Like(1, null, 4, "dislike"),
    new Like(5, null, 4, "dislike")
];

export { users, threads, posts, likes };
