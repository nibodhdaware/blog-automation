const bodyParser = require("body-parser");
const express = require("express");
const mysqlConnection = require("./connection");
const schedule = require("node-schedule");

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
                    _id
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

schedule.scheduleJob("0 0 * * 0", () => {
    gql(GET_USER_ARTICLES, { page: 0 }).then((result) => {
        const articles = result.data.user.publication.posts;
        // mysqlConnection.query("TRUNCATE Posts.PostInfo");
        articles.forEach((article) => {
            const insert =
                "INSERT INTO PostInfo(id, title, brief, slug, dateAdded, contentMarkdown, coverImage) VALUES ?";
            const id = article._id;
            const title = article.title;
            const brief = article.brief;
            const slug = article.slug;
            const dateAdded = article.dateAdded;
            const contentMarkdown = article.contentMarkdown;
            const coverImage = article.coverImage;

            const values = [
                [
                    id,
                    title,
                    brief,
                    slug,
                    dateAdded,
                    contentMarkdown,
                    coverImage,
                ],
            ];

            mysqlConnection.query(
                "SELECT * FROM PostInfo WHERE id = '" + id + "';",
                function (err, row) {
                    if (err) {
                        console.log("something went wrong");
                        console.log(err);
                        return;
                    } else {
                        if (row && row.length) {
                            console.log("Case row was found!");
                            // do something with your row variable
                        } else {
                            mysqlConnection.query(
                                insert,
                                [values],
                                (err, result, fields) => {
                                    if (err) console.log(err);
                                },
                            );
                            mysqlConnection.query(
                                "UPDATE PostInfo SET dateAdded = SUBSTR(dateAdded, 1, 10);",
                            );
                        }
                    }
                },
            );
        });
    });
});
