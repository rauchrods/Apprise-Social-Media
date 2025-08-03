import "./rightPanel.scss";
import SuggestedUserCard from "../suggestedUserCard/SuggestedUserCard";
import SuggestedUserCardSkeleton from "../suggestedUserCard/SuggestedUserCardSkeleton";
import useFetch from "../../hooks/useFetch";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useFetch("/api/users/suggested", {
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="right-panel">
      {suggestedUsers && suggestedUsers.users.length > 0 && (
        <p>Who to follow</p>
      )}
      <div className="suggestion-container">
        {/* item */}
        {isLoading && (
          <>
            <SuggestedUserCardSkeleton />
            <SuggestedUserCardSkeleton />
            <SuggestedUserCardSkeleton />
            <SuggestedUserCardSkeleton />
          </>
        )}

        {!isLoading && suggestedUsers && suggestedUsers.users.length === 0 && (
          <p>No Suggestions</p>
        )}
        {!isLoading &&
          suggestedUsers &&
          suggestedUsers.users.map((user) => (
            <SuggestedUserCard user={user} key={user._id} />
          ))}
      </div>
    </div>
  );
};
export default RightPanel;
