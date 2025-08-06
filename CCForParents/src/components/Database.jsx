import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../assets/dbClient.js"; // Adjust the import path as needed

function Database() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [newPost, setNewPost] = useState({
        question: "",
        additionalinfo: ""
    });
    
    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        setLoading(true);
        console.log("Attempting to fetch posts from CCPOSTS table...");
        
        const { data: posts, error } = await supabase
            .from("CCPOSTS")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            console.error("Error details:", error.details);
            console.error("Error hint:", error.hint);
            setError(error.message);
        } else {
            console.log("Fetched posts:", posts);
            console.log("Number of posts:", posts ? posts.length : 0);
            if (posts && posts.length > 0) {
                console.log("Sample post:", posts[0]);
            }
            setData(posts || []);
        }
        setLoading(false);
    }

    // Add a return statement to render the component
    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Database Posts</h2>
            {data.length === 0 ? (
                <p>No posts found in database.</p>
            ) : (
                <div>
                    <p>Found {data.length} posts:</p>
                    {data.map(post => (
                        <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                            <h3>{post.question}</h3>
                            <p>{post.additionalinfo}</p>
                            {post.reply && (
                                <div style={{ marginTop: '10px', padding: '5px', backgroundColor: '#f0f0f0' }}>
                                    <strong>Reply:</strong> {post.reply}
                                </div>
                            )}
                            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                <span>👍 {post.likes || 0} likes</span>
                                <span style={{ marginLeft: '15px' }}>Created: {new Date(post.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Database;