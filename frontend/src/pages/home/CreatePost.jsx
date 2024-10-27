import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Avatar from "../../ui/avatar/Avatar";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import "./createPost.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            image: img,
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
      setImg(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // console.log(reader);
        setImg(reader.result);
      };
      reader.readAsDataURL(file);

      // setImg(URL.createObjectURL(file));
    }
  };

  console.log("text: ", text);
  console.log("image: ", img);

  return (
    <div className="create-post-container">
      <Avatar
        src={authUser?.profileImg || "/avatar-placeholder.png"}
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
          <Button
            style={{ padding: "6px 12px", borderRadius: "15px" }}
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
        {/* {isError && <div className="text-red-500">Something went wrong</div>} */}
      </form>
    </div>
  );
};
export default CreatePost;
