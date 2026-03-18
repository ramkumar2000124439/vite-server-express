import { Router } from "express";
import { taffy } from "./taffy"

const router = Router();

const init = async () => {
    const requestUsers = await fetch("http://jsonplaceholder.typicode.com/users");
    const requestPosts = await fetch("http://jsonplaceholder.typicode.com/posts");
    const posts = await requestPosts.json();
    const users = await requestUsers.json();

    return { usersDb: taffy(users), postsDb: taffy(posts) }
}

const { usersDb, postsDb } = await init();

router.get("/", (req, res) => {
    res.json({ message: "Hello from Express API!" });
});

router.get("/users", async (req, res) => {
    res.json(usersDb().get());
});

router.get("/posts", async (req, res) => {
    res.json(postsDb().get());
});

router.get("/users/:id/posts", async (req, res) => {
    const userId = parseInt(req.params.id);
    const userPosts = postsDb({ userId }).get();
    res.json(userPosts);
});

router.get("/posts/:id", async (req, res) => {  
    const postId = parseInt(req.params.id);
    const post = postsDb({ id: postId }).first();
    const author = usersDb({ id: post.userId }).first();
    post.author = author;
    
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

export default router;