/*
No longer need in favor of .env file process.env.PUBLISHABLE_KEY & process.env.SECRET_KEY
const PUBLISHABLE_KEY =
  "pk_test_51JTrXPKDcwwl1Oe4ruMMSSeMbkN4UpcWTTX63KSESmrXJZtYEehiHgGVumzCUFloG5csmIwxe2ZrHOj4XqVXezDj00JPjSoMPw";

const SECRET_KEY =
  "sk_test_51JTrXPKDcwwl1Oe4PC3sfoZrsbSmAz6t9jE9IwEMBDcM3ycxS908pssnFyvHn6UUEll2plSJ7804NYxDfqUU19l4008a5Qjrs5";
*/
require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 3001;

/**
 * Tells app to run on local Port
 */
app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
