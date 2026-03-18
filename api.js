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

router.get("/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = usersDb({ id: userId }).first();
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: "User not found" });
    }
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

    if (post) {
        res.json({ ...post, author });
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

export default router;