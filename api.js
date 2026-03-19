import { Router } from "express";
import { taffy } from "./taffy"

const router = Router();

let usersDb = taffy([]);
let postsDb = taffy([]);

const init = async () => {
    try {
        const requestUsers = await fetch("http://jsonplaceholder.typicode.com/users");
        const requestPosts = await fetch("http://jsonplaceholder.typicode.com/posts");
        
        if (!requestUsers.ok || !requestPosts.ok) {
            throw new Error(`Failed to fetch data: ${!requestUsers.ok ? 'users' : 'posts'} request failed`);
        }
        
        const posts = await requestPosts.json();
        const users = await requestUsers.json();

        usersDb = taffy(users);
        postsDb = taffy(posts);
        
        console.log(`API initialized with ${users.length} users and ${posts.length} posts`);
    } catch (error) {
        console.error('Error initializing API data:', error.message);
        console.warn('Continuing with empty databases');
    }
}

await init();

router.get("/", (req, res) => {
    res.json({ message: "Hello from Express API!" });
});

router.get("/users", async (req, res) => {
    try {
        res.json(usersDb().get());
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = usersDb({ id: userId }).first();
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

router.get("/posts", async (req, res) => {
    try {
        res.json(postsDb().get());
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

router.get("/users/:id/posts", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const userPosts = postsDb({ userId }).get();
        res.json(userPosts);
    } catch (error) {
        console.error('Error fetching user posts:', error.message);
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
});

router.get("/posts/:id", async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        if (isNaN(postId)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }
        const post = postsDb({ id: postId }).first();
        const author = usersDb({ id: post?.userId }).first();

        if (post) {
            res.json({ ...post, author });
        } else {
            res.status(404).json({ error: "Post not found" });
        }
    } catch (error) {
        console.error('Error fetching post:', error.message);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

export default router;