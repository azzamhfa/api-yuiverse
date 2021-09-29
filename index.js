var express = require("express");
var puppeteer = require("puppeteer");
var app = express();

app.listen(3000 || 5001);
// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
  res.send("hello world");
});

app.get("/data", function (req, res) {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      await page.goto(
        "https://sakurazaka101.com/translated-blogs/1st-generation/kobayashi-yui/"
      );

      const content = await page.evaluate(() => {
        const card = document.querySelectorAll(".anwp-pg-post-teaser");
        const data = Array.from(card).map((pon) => {
          // TITLE BLOG PON
          const title = pon.querySelector(
            ".anwp-pg-post-teaser__title"
          ).innerText;

          //COVER BLOG PON
          const coverPon = pon.querySelector(
            ".anwp-pg-post-teaser__thumbnail-img"
          ).style.backgroundImage;

          const url = coverPon.slice(5, coverPon.length - 2);

          //SPOILER TEXT PON
          const spoiler = pon.querySelector(
            ".anwp-pg-post-teaser__excerpt"
          ).innerText;

          // listCover = [];
          return { title: title, cover: url, spoiler: spoiler };
        });

        return data;
      });
      // return content;
      res.status(200);
      res.json(content);
    } catch (error) {
      console.log(error);
    }
    await browser.close();
  })();
});
