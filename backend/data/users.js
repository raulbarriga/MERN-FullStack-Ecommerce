import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10), //there's a few different ways to hash our passwords
    //normally you'd want to do this asynchronously, but since right now it's just data that we're importing (not an actual register form), we'll just use this method from bcryptjs
    isAdmin: true,
  },
  {
    name: "Test User1",
    email: "test1@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Test User2",
    email: "test2@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
