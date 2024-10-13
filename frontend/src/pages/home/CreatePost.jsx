import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Avatar from "../../ui/avatar/Avatar";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import "./createPost.scss";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const isPending = false;
  const isError = false;

  const data = {
    profileImg: "/avatars/boy1.png",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Post created successfully");
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log(reader);
        setImg(reader.result);
      };
    }
  };

  console.log(img);

  return (
    <div className="create-post-container">
      <Avatar
        src={data.profileImg || "/avatar-placeholder.png"}
        style={{ width: "35px", height: "35px" }}
      />

      <form className="create-post-form" onSubmit={handleSubmit}>
        <Input
          isTextarea={true}
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="create-post-textbox"
        />
        {img && (
          <div className="post-img-container">
            <IoCloseSharp
              className=""
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img src={img} />
          </div>
        )}

        <div className="bottom-container">
          <div className="icon-container">
            <CiImageOn
              style={{ fontSize: "25px" }}
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill style={{ fontSize: "25px" }} />
          </div>
          <input
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
            accept="image/*"
          />
          <Button style={{ padding: "6px 12px", borderRadius: "15px" }}>
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};
export default CreatePost;
