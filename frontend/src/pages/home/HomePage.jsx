import { useState } from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/posts/Posts";
import "./homePage.scss";
import PageLayout from "../../components/pageLayout/PageLayout";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <PageLayout>
      <div className="home-page">
        {/* Header */}
        <div className="option-header">
          <div onClick={() => setFeedType("forYou")}>
            <span className={feedType === "forYou" ? "selected" : ""}>
              For you
            </span>
          </div>
          <div onClick={() => setFeedType("following")}>
            <span className={feedType === "following" ? "selected" : ""}>
              Following
            </span>
          </div>
        </div>

        {/*  CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts feedType={feedType} />
      </div>
    </PageLayout>
  );
};
export default HomePage;
