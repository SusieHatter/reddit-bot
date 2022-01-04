const axios = require("axios");

function choose(array) {
  return array[Math.floor(array.length * Math.random())];
}

const POST_TYPES = ["rich:video", "image"];

async function getPost(subreddit) {
  const response = await axios({
    method: "get",
    url: `https://www.reddit.com/r/${subreddit}.json?limit=100`,
    responseType: "json",
  });
  const choices = response.data.data.children
    .map((c) => c.data)
    .filter((d) => POST_TYPES.includes(d.post_hint));
  const choice = choose(choices);
  return choice;
}

module.exports = {
  getPost,
};
