import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor, { EditorContext } from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import "../shared/markdown_editor.css";

async function UpdateBlog(blogData, id) {
    try {
        const response = await axios.put(`http://localhost:5000/blogs/${id}`, blogData);
        console.log("Blog updated successfully:", response.data);
    } catch (err) {
        console.error(err.message);
    }
}

const PreviewButton = () => {
    const { preview, dispatch } = React.useContext(EditorContext);
    const click = () => {
        if (dispatch) {
            dispatch({
                preview: "preview",
            });
        }
    };
    return (
        <span
            style={{
                backgroundColor: preview === "preview" ? "#fff" : "#f6f8fa",
                borderTopLeftRadius: preview === "preview" ? "8px" : "0px",
                borderTopRightRadius: preview === "preview" ? "8px" : "0px",
                borderRight: preview === "preview" ? "1px solid #d0d7de" : "none",
                borderLeft: preview === "preview" ? "1px solid #d0d7de" : "none",
                padding: "11px 16px 12px 16px",
                fontSize: "14px",
            }}
            onClick={click}
        >
            Preview
        </span>
    );
};

const customPreviewCommand = {
    name: "custom-preview",
    keyCommand: "custom-preview",
    buttonProps: { "aria-label": "Generate Preview" },
    icon: <PreviewButton />,
};

const WriteButton = () => {
    const { preview, dispatch } = React.useContext(EditorContext);
  
    const click = () => {
        if (dispatch) {
            dispatch({
                preview: "edit",
            });
        }
    };
    return (
        <span
            style={{
                backgroundColor: preview === "edit" ? "#fff" : "#f6f8fa",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: preview === "edit" ? "8px" : "0px",
                borderRight: preview === "edit" ? "1px solid #d0d7de" : "none",
                padding: "11px 16px 12px 16px",
                fontSize: "14px",
            }}
            onClick={click}
        >
            Write
        </span>
    );
};

const editPreviewCommand = {
    name: "edit-preview",
    keyCommand: "edit-preview",
    buttonProps: { "aria-label": "Generate Edit" },
    icon: <WriteButton />,
};

export default function EditBlogView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState({
        title: '',
        body: ''
    });

    const [markdownValue, setMarkdownValue] = useState("");

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/blogs/${id}`);
                setBlogData({
                    title: response.data.title,
                    body: response.data.body,
                });
                setMarkdownValue(response.data.body);
            } catch (error) {
                console.error('Error fetching blog data:', error);
            }
        };

        fetchBlogData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await UpdateBlog({
            ...blogData,
            body: markdownValue
        }, id);
        navigate('/blogs'); // Redirect after update
    };

    return (
        <div className="edit-blog-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Blog Title</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={blogData.title}
                        onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                        required
                    />
                </div>
                <div className="editor-container">
                    <MDEditor
                        height={300}
                        visibleDragbar={false}
                        commands={[
                            editPreviewCommand,
                            customPreviewCommand,
                        ]}
                        extraCommands={[]}
                        preview="edit"
                        previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                        }}
                        value={markdownValue}
                        onChange={setMarkdownValue}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Blog</button>
            </form>
        </div>
    );
}
