import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { supabase } from "../assets/dbClient.js";


const Posts = forwardRef(({ posts, onPostsUpdate }, ref) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({});
  const [sortOption, setSortOption] = useState('newest'); // Default sort option
  const [editingPost, setEditingPost] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search functionality

  // Fetch replies for all posts
  const fetchReplies = async () => {
    console.log("Fetching replies...");
    const { data: repliesData, error } = await supabase
      .from('REPLIES')
      .select('*')
      .order('created_at', { ascending: true });
      
    console.log("Replies fetch result:", { repliesData, error });
    
    if (!error && repliesData) {
      // Group replies by post_id
      const repliesByPost = {};
      repliesData.forEach(reply => {
        if (!repliesByPost[reply.post_id]) {
          repliesByPost[reply.post_id] = [];
        }
        repliesByPost[reply.post_id].push(reply);
      });
      console.log("Grouped replies:", repliesByPost);
      setReplies(repliesByPost);
    } else {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  // Filter and sort posts based on search term and selected option
  const getFilteredAndSortedPosts = () => {
    let filteredPosts = [...posts];
    
    // First filter by search term
    if (searchTerm.trim()) {
      filteredPosts = posts.filter(post => 
        post.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.additionalinfo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Then sort the filtered results
    switch (sortOption) {
      case 'newest':
        return filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return filteredPosts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'most_liked':
        return filteredPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'least_liked':
        return filteredPosts.sort((a, b) => (a.likes || 0) - (b.likes || 0));
      default:
        return filteredPosts;
    }
  };

  const createpost = (newPost) => {
    // Your existing createpost logic here
    console.log("Creating post:", newPost);
  };

  const handleLike = async (postId, currentLikes) => {
    console.log("Like button clicked for post:", postId, "current likes:", currentLikes);
    const newLikes = (currentLikes || 0) + 1;
    console.log("Updating to:", newLikes);
    
    const { data, error } = await supabase
      .from('CCPOSTS')
      .update({ likes: newLikes })
      .eq('id', postId)
      .select();
    
    if (!error) {
      console.log("Like updated successfully:", data);
      // Refresh the posts to show updated likes count
      if (onPostsUpdate) {
        onPostsUpdate();
      }
    } else {
      console.error("Error updating likes:", error);
    }
  };

  const handleReply = (postId) => {
    setReplyingTo(postId);
    setReplyText("");
  };

  const submitReply = async (postId) => {
    if (!replyText.trim()) return;

    console.log("Submitting reply for post:", postId, "Reply text:", replyText);

    const { data, error } = await supabase
      .from('REPLIES')
      .insert([{
        post_id: postId,
        reply_text: replyText,
        author_name: 'Anonymous' // or get from user
      }])
      .select(); // Add select to get back the inserted data

    console.log("Reply submission result:", { data, error });

    if (!error) {
      setReplyingTo(null);
      setReplyText("");
      fetchReplies(); // Refresh replies
    } else {
      console.error("Error submitting reply:", error);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This will also delete all replies.")) {
      return;
    }

    console.log("Deleting post:", postId);

    const { error } = await supabase
      .from('CCPOSTS')
      .delete()
      .eq('id', postId);

    if (!error) {
      console.log("Post deleted successfully");
      // Refresh the posts to show updated list
      if (onPostsUpdate) {
        onPostsUpdate();
      }
      // Also refresh replies since they might be affected
      fetchReplies();
    } else {
      console.error("Error deleting post:", error);
    }
  };

  const deleteReply = async (replyId, postId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    console.log("Deleting reply:", replyId);

    const { error } = await supabase
      .from('REPLIES')
      .delete()
      .eq('id', replyId);

    if (!error) {
      console.log("Reply deleted successfully");
      fetchReplies(); // Refresh replies
    } else {
      console.error("Error deleting reply:", error);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditQuestion(post.question);
    setEditDetails(post.additionalinfo);
  };

  const submitEditPost = async (postId) => {
    if (!editQuestion.trim() || !editDetails.trim()) {
      alert("Please fill in both question and details fields.");
      return;
    }

    console.log("Updating post:", postId);

    const { error } = await supabase
      .from('CCPOSTS')
      .update({
        question: editQuestion,
        additionalinfo: editDetails
      })
      .eq('id', postId);

    if (!error) {
      console.log("Post updated successfully");
      setEditingPost(null);
      setEditQuestion("");
      setEditDetails("");
      // Refresh the posts to show updated content
      if (onPostsUpdate) {
        onPostsUpdate();
      }
    } else {
      console.error("Error updating post:", error);
    }
  };

  const cancelEditPost = () => {
    setEditingPost(null);
    setEditQuestion("");
    setEditDetails("");
  };

  useImperativeHandle(ref, () => ({
    createpost
  }));

  return (
    <div>
      <h1 className="HomepageHeaders">Recent Questions</h1>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search posts by question or details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="clear-search-btn"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Sort Options */}
      <div className="sort-container">
        <label htmlFor="sortSelect" className="sort-label">
          Sort by:
        </label>
        <select 
          id="sortSelect"
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most_liked">Most Liked</option>
          <option value="least_liked">Least Liked</option>
        </select>
        <span className="sort-count">
          ({getFilteredAndSortedPosts().length} posts)
        </span>
      </div>
      
      {posts.length === 0 ? (
        <p>No questions yet. Be the first to ask!</p>
      ) : getFilteredAndSortedPosts().length === 0 ? (
        <p>No posts match your search. Try different keywords or clear the search.</p>
      ) : (
        getFilteredAndSortedPosts().map(post => (
          <div key={post.id} className="post-item" style={{ border: '1px solid #ccc', margin: '10px', padding: '15px', borderRadius: '8px' }}>
            {editingPost === post.id ? (
              // Edit form
              <div className="edit-form">
                <div className="edit-form-group">
                  <label className="edit-label">Question:</label>
                  <input
                    type="text"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    className="edit-input"
                  />
                </div>
                <div className="edit-form-group">
                  <label className="edit-label">Details:</label>
                  <textarea
                    value={editDetails}
                    onChange={(e) => setEditDetails(e.target.value)}
                    className="edit-textarea"
                  />
                </div>
                <div>
                  <button 
                    onClick={() => submitEditPost(post.id)}
                    style={{ 
                      backgroundColor: '#228B22',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={cancelEditPost}
                    style={{ 
                      backgroundColor: '#ccc',
                      color: '#333',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Normal post display
              <>
                <h3>{post.question}</h3>
                <p>{post.additionalinfo}</p>
              </>
            )}
            {post.reply && (
              <div style={{ marginTop: '10px', padding: '5px', backgroundColor: '#f0f0f0' }}>
                <strong>Reply:</strong> {post.reply}
              </div>
            )}
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <button 
                onClick={() => handleLike(post.id, post.likes)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '14px',
                  marginRight: '10px',
                  padding: '5px',
                  borderRadius: '4px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                }}
              >
                👍 {post.likes || 0} likes
              </button>
              <button 
                onClick={() => handleReply(post.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '14px',
                  marginRight: '10px',
                  padding: '5px',
                  borderRadius: '4px',
                  backgroundColor: '#e6f3ff',
                  color: '#333',
                }}
              >
                💬 Reply
              </button>
              <button 
                onClick={() => handleEditPost(post)}
                className="edit-post-btn"
                title="Edit post"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={() => deletePost(post.id)}
                className="delete-post-btn"
                title="Delete post"
              >
                🗑️ Delete
              </button>
              <span style={{ marginLeft: '15px' }}>
                Posted: {post.created_at ? new Date(post.created_at).toLocaleString() : 'No date'}
              </span>
            </div>
            {replyingTo === post.id && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  style={{ 
                    width: '100%', 
                    minHeight: '60px', 
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}
                />
                <div>
                  <button 
                    onClick={() => submitReply(post.id)}
                    style={{ 
                      backgroundColor: '#228B22',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Submit Reply
                  </button>
                  <button 
                    onClick={cancelReply}
                    style={{ 
                      backgroundColor: '#ccc',
                      color: '#333',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {replies[post.id] && replies[post.id].length > 0 ? (
              <div style={{ marginTop: '10px' }}>
                <strong>Replies ({replies[post.id].length}):</strong>
                {replies[post.id].map(reply => (
                  <div key={reply.id} className="reply-container">
                    <div className="reply-content">
                      <div className="reply-text">
                        <strong>Reply:</strong> {reply.reply_text}
                        <br />
                        <small>By: {reply.author_name} - {new Date(reply.created_at).toLocaleString()}</small>
                      </div>
                      <button 
                        onClick={() => deleteReply(reply.id, post.id)}
                        className="delete-reply-btn"
                        title="Delete reply"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                No replies yet
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
});

export default Posts;