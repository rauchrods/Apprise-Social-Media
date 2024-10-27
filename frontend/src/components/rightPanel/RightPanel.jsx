import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import "./rightPanel.scss";
import SuggestedUserCard from "../suggestedUserCard/SuggestedUserCard";
import SuggestedUserCardSkeleton from "../suggestedUserCard/SuggestedUserCardSkeleton";
import { useQuery } from "@tanstack/react-query";

const RightPanel = () => {
  let { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
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
