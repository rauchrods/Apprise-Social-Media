import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Avatar from "../../ui/avatar/Avatar";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import "./createPost.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import EmojiModal from "../../components/emojiModal/EmojiModal";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const imgRef = useRef(null);

  const textAreaRef = useRef(null);

  const { user: authUser } = useSelector((state) => state.auth);

  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, images }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            images: images,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      setText("");
      setImages([]);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, images });
  };

  const handleImgChange = (e) => {
    const files = Array.from(e.target.files);
    // console.log(files);
    if (files.length > 0) {
      const newImages = [];

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          newImages.push(reader.result);

          // Check if all files have been processed
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages]);
          }
        };

        reader.readAsDataURL(file);
      });
    }
  };

  const handleEmojiClick = (emoji) => {
    const textArea = textAreaRef.current;
    const cursorPosition = textArea.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPosition);
    const textAfterCursor = text.substring(cursorPosition);

    const newText = textBeforeCursor + emoji + textAfterCursor;
    setText(newText);
    textArea.focus();

    setShowEmojiPicker(false);
  };

  const handleEmojiToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="create-post-container">
      <Avatar
        src={authUser?.profileImage || "/avatar-placeholder.png"}
        style={{ width: "35px", height: "35px" }}
      />

      <form className="create-post-form" onSubmit={handleSubmit}>
        <Input
          isTextarea={true}
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="create-post-textbox"
          ref={textAreaRef}
        />
        {images.length > 0 && (
          <div className="post-img-container">
            <IoCloseSharp
              onClick={() => {
                setImages([]);
                imgRef.current.value = null;
              }}
            />
            <ImageSlider images={images} />
          </div>
        )}

        <div className="bottom-container">
          <div className="icon-container">
            <CiImageOn
              style={{ fontSize: "25px" }}
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill
              style={{ fontSize: "25px", cursor: "pointer" }}
              onClick={handleEmojiToggle}
            />
          </div>
          <input
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
            accept="image/*"
            multiple
          />
          <Button
            style={{ padding: "6px 12px", borderRadius: "15px" }}
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
        {/* {isError && <div className="text-red-500">Something went wrong</div>} */}
      </form>

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
        <EmojiModal
          setShowEmojiPicker={setShowEmojiPicker}
          handleEmojiClick={handleEmojiClick}
        />
      )}
    </div>
  );
};
export default CreatePost;
