export const getUserToken = () => {
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("token")
      : "anonymous";

  return token;
};
