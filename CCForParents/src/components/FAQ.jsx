import React, { useState, useEffect } from "react";
import Posts from "./Posts.jsx";
import { supabase } from "../assets/dbClient.js";

/*React functional component, define a function called Home*/

const FAQ = () => {
  const [posts, setPosts] = useState([]); // Store posts in FAQ component

  useEffect(() => {
    fetchPostsFromDB();
  }, []);

  // Create function to fetch from database
  async function fetchPostsFromDB() {
    console.log("Fetching posts from database...");
    const { data: dbPosts, error } = await supabase
      .from("CCPOSTS")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (!error && dbPosts) {
      console.log("Posts fetched:", dbPosts);
      setPosts(dbPosts);
    } else {
      console.error("Error fetching posts:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //Create a new post from form data
    if (!e.target.subject.value || !e.target.message.value) {
      return; // Exit if fields are empty
    }
    
    const formData = new FormData(e.target);
    const newPost = {
      question: formData.get('subject'),
      additionalinfo: formData.get('message'),
      likes: 0,
      reply: null
    };
    
    // Save to database
    const { error } = await supabase
      .from("CCPOSTS")
      .insert([newPost]);
      
    if (!error) {
      fetchPostsFromDB(); // Refresh the list
      e.target.reset(); // Clear form
    } else {
      console.error("Error saving post:", error);
    }
  };

  return (
    <div>
      <h1 className="HomepageHeaders">Ask Us A Question</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="form-group">
          <label htmlFor="subject">Question</label>
          <input type="text" id="subject" name="subject" className="contact-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Provide Details</label>
          <textarea id="message" name="message" className="contact-textarea" required></textarea>
        </div>
        <button type="submit" className="contact-submit">
          Create Post
        </button>
      </form>
      
      {/* Posts Feed */}
      <Posts posts={posts} onPostsUpdate={fetchPostsFromDB} />
    </div>
  );
};

/*allow users to create posts and see a feed of them on the home page, 
edit, delete, or leave comments underneath them for discussions, 
and give upvotes for posts that you like*/

export default FAQ;