const get = async (user) => {
  const { token, email, id, username, picture } = user;

  return {
    token: token,
    user: {
      id: id,
      email: email,
      username: username,
      picture: picture,
    },
  };
};

export default { get };
