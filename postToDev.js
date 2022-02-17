require("dotenv").config();

import fetch from "node-fetch";

const apiKey = process.env.DEV_TO_API_KEY;
const apiUrl = "https://dev.to/api/articles";

async function postToDev(query, variables = {}) {
  const data = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return data.json();
}
