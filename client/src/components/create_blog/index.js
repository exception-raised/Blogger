import axios from 'axios';
import React from 'react';
import MDEditor, {EditorContext} from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import "./markdown_editor.css";
import { useCookies } from 'react-cookie';

async function CreateBlog(blogData) {
    try {
        console.log(blogData);
        const response = await axios.post("http://localhost:5000/blogs", blogData);
        console.log("Blog created successfully:", response.data);
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
  

export default function CreateBlogView() {
    const [blogData, setBlogData] = React.useState({
      title: '', 
      user_id: '' 
    });

    // const token = useCookies(['token']);
    // if (token) {
    //   const decodedToken = jwt.decode(token);
    //   let userId = decodedToken.id; // Access the user ID
    //   console.log(userId);

    // }

    const [markdownValue, setMarkdownValue] = React.useState("**Hello world!!!**");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await CreateBlog({
            ...blogData,
            body: markdownValue
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ width: "600px" }}>
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
            <button type="submit">Create Blog</button>
        </form>
    );
}