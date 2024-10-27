import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: followUnfollow, isPending } = useMutation({
    mutationFn: async ({ id }) => {
      try {
        const res = await fetch(`/api/users/follow/${id}`, {
          method: "POST",
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
      toast.success("Followed successfully");
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    followUnfollow,
    isPending,
  };
};

export default useFollow;
