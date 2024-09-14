export const signup = async (req, res) => {
  res.status(200).json({
    data: "signup api called successfully",
  });
};

export const login = async (req, res) => {
  res.status(200).json({
    data: "login api called successfully",
  });
};

export const logout = async (req, res) => {
  res.status(200).json({
    data: "logout api called successfully",
  });
};
