import bodyParser from "body-parser";
import express from "express";
import fetch from "node-fetch";
import schedule from "node-schedule";
import mysqlConnection from "./connection.js";

const app = express();
app.use(bodyParser.json());

async function gql(query, variables = {}) {
  const data = await fetch("https://api.hashnode.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return data.json();
}

const GET_USER_ARTICLES = `
    query GetUserArticles($page: Int!) {
        user(username: "nibodhdaware") {
            publication {
                posts(page: $page) {
                    title
                    brief
                    slug
                    dateAdded
                    contentMarkdown
                    coverImage
                }
            }
        }
    }
`;

schedule.scheduleJob("* * * * *", function () {
  gql(GET_USER_ARTICLES, { page: 0 }).then((result) => {
    const articles = result.data.user.publication.posts;
    mysqlConnection.query("TRUNCATE Posts.PostInfo");
    articles.forEach((article) => {
      const insert =
        "INSERT INTO Posts.PostInfo(title, brief, slug, dateAdded, contentMarkdown, coverImage) VALUES ?";
      const title = article.title;
      const brief = article.brief;
      const slug = article.slug;
      const dateAdded = article.dateAdded;
      const contentMarkdown = article.contentMarkdown;
      const coverImage = article.coverImage;

      const values = [
        [title, brief, slug, dateAdded, contentMarkdown, coverImage],
      ];

      mysqlConnection.query(insert, [values], (err, result, fields) => {
        if (err) console.log(err);
        else console.log(result);
      });
      mysqlConnection.query(
        "UPDATE Posts.PostInfo SET dateAdded = SUBSTR(dateAdded, 1, 10);",
      );
    });
  });
});
