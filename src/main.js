const { Client, Intents } = require("discord.js");
const { token, subreddits, autoPostChannelId } = require("./config.js");
const { getPost } = require("./reddit.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "post") {
    await handlePost(interaction);
  }
});

async function handlePost(interaction) {
  const subreddit = interaction.options.getString("subreddit");
  const post = await getPost(subreddit);
  interaction.reply(post.url);
}

async function postRandomPost(subreddit) {
  const channel = client.channels.cache.get(autoPostChannelId);
  const post = await getPost(subreddit);
  channel.send(post.url);
}

async function postRandomPosts() {
  subreddits.forEach((subreddit) => {
    postRandomPost(subreddit);
  });
}

const POST_TIME_CHECK_INTERVAL = 1000 * 60 * 60;

function isPostingTime(date = new Date()) {
  const hour = date.getHours();
  return hour === 7;
}

setInterval(() => {
  if (!isPostingTime()) {
    return;
  }
  postRandomPosts();
}, POST_TIME_CHECK_INTERVAL);

client.login(token);
