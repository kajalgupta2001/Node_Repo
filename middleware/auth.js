const jwt = require("jsonwebtoken");
const User = require("../Model/user");

const auth = async (req, resp, next) => {
  const token = req.cookies.token;
  console.log(token);

  try {
    const user = await jwt.verify(token, process.env.S_KEY);
    const CurrentUser = await User.findById(user._id);
    console.log(CurrentUser);

    if (user) {
      const isValid = CurrentUser.Tokens.find((ele) => {
        return ele.token == token;
      });

      if (isValid) {
        req.user = CurrentUser;
        req.token = token;
        next();
      } else {
        resp.render("login", { err: "Please login first !!!" });
      }
    }
  } catch (error) {
    console.log(error);

    resp.render("login", { err: "pls login first!" });
  }
};
module.exports = auth;
