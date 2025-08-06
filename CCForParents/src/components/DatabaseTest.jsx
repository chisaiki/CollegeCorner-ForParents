import React, { useState, useEffect } from 'react';
import { supabase } from '../assets/dbClient.js';

const DatabaseTest = () => {
  const [tables, setTables] = useState([]);
  const [repliesData, setRepliesData] = useState([]);
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    checkTables();
    fetchData();
  }, []);

  const checkTables = async () => {
    // Check if REPLIES table exists
    const { data, error } = await supabase
      .from('REPLIES')
      .select('*')
      .limit(1);
    
    console.log("REPLIES table check:", { data, error });
    
    if (error) {
      setTables(prev => [...prev, `REPLIES table error: ${error.message}`]);
    } else {
      setTables(prev => [...prev, "REPLIES table exists"]);
    }
  };

  const fetchData = async () => {
    // Fetch posts
    const { data: posts, error: postsError } = await supabase
      .from('CCPOSTS')
      .select('*');
    
    if (!postsError) {
      setPostsData(posts);
      console.log("Posts:", posts);
    }

    // Fetch replies
    const { data: replies, error: repliesError } = await supabase
      .from('REPLIES')
      .select('*');
    
    if (!repliesError) {
      setRepliesData(replies);
      console.log("Replies:", replies);
    } else {
      console.error("Replies error:", repliesError);
    }
  };

  const createTestReply = async () => {
    if (postsData.length > 0) {
      const { data, error } = await supabase
        .from('REPLIES')
        .insert([{
          post_id: postsData[0].id,
          reply_text: 'Test reply from DatabaseTest component',
          author_name: 'Test User'
        }])
        .select();
      
      console.log("Test reply result:", { data, error });
      if (!error) {
        fetchData(); // Refresh data
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Database Test Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Table Status:</h3>
        {tables.map((table, index) => (
          <div key={index}>{table}</div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Posts ({postsData.length}):</h3>
        {postsData.slice(0, 2).map(post => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
            ID: {post.id} | Question: {post.question}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Replies ({repliesData.length}):</h3>
        {repliesData.map(reply => (
          <div key={reply.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
            ID: {reply.id} | Post ID: {reply.post_id} | Reply: {reply.reply_text}
          </div>
        ))}
      </div>

      <button onClick={createTestReply} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
        Create Test Reply
      </button>
    </div>
  );
};

export default DatabaseTest;
