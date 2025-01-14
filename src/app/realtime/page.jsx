"use client";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false); // State to track subscription

  useEffect(() => {
    const fetchPosts = async () => {
      const records = await pb.collection("posts").getFullList();
      setPosts(records);
    };

    fetchPosts();

    let realTime;
    // Subscribe when the component mounts if already subscribed
    if (isSubscribed) {
      realTime = pb.collection("posts").subscribe("*", (data) => {
        if (data.action === "create") {
          setPosts((prev) => [...prev, data.record]);
        } else if (data.action === "update") {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === data.record.id ? data.record : post
            )
          );
        } else if (data.action === "delete") {
          setPosts((prev) => prev.filter((post) => post.id !== data.record.id));
        }
      });
    }

    // Cleanup: Unsubscribe when the component unmounts or subscription changes
    return () => {
      if (realTime) {
        pb.collection("posts").unsubscribe();
      }
    };
  }, [isSubscribed]);

  const toggleSubscription = () => {
    setIsSubscribed((prev) => !prev);
  };

  const createRandomPost = async () => {
    for (let i = 0; i < 10; i++) {
        const newPost = {
        likes: Math.floor(Math.random() * 100),  
      };
      await pb.collection("posts").create(newPost);
    }
  }

  return (
    <div>
      <h1>Real-time Posts</h1>
      <button onClick={toggleSubscription}>
        {isSubscribed ? "Unsubscribe" : "Subscribe"} to Real-time Updates
      </button>
      <br></br>
      <button onClick={createRandomPost}>Create Ten Random Posts</button>
      <br></br>
      <h1>Number of Posts: {posts.length}</h1>
      <pre>
        <ul>{JSON.stringify(posts, null, 2)}</ul>
      </pre>
    </div>
  );
}
