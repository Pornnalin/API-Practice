const searchEle = document.querySelector("#search-form");
searchEle.addEventListener("submit", (e) => {
  e.preventDefault();
  const search = searchEle.elements["search-box"].value;
  req(search);
});

const req = async (search) => {
  try {
    const config = { params: { q: search, limit: 10 } };
    const res = await axios.get("https://api.jikan.moe/v4/anime", config);

    checkExitsEle("#cardList");
    checkExitsEle("#message");

    if (res.data.data.length === 0) {
      const message = document.createElement("p");
      message.id = "message";
      message.innerHTML = "Not Found";
      document.body.appendChild(message);
    }

    const divList = document.createElement("div");
    divList.id = "cardList";
    divList.className = "flex flex-col gap-5 py-5 justify-items-center";
    document.body.appendChild(divList);

    listAnime(res, divList);
  } catch (err) {
    console.error("Fail", err);
  }

  function checkExitsEle(id) {
    const targetElement = document.querySelector(id);
    if (targetElement) {
      targetElement.remove();
    }
  }

  function listAnime(res, parent) {
    let genresNames;
    for (const item of res.data.data) {
      if (item.genres.length > 0) {
        genresNames = item.genres.map((e) => e.name);
      } else {
        genresNames = ["-"];
      }

      const divCard = document.createElement("div");
      divCard.id = "card-info";
      divCard.className =
        "flex flex-col sm:flex-row bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-full";
      parent.appendChild(divCard);

      //create Img
      createIm(item.images.jpg.image_url, divCard);

      const divPara = document.createElement("div");
      divPara.className = "flex flex-col w-full justify-start gap-3 p-2.5";
      divCard.appendChild(divPara);

      createPara("<b>Title</b>", checkValue(item.title), divPara);
      createPara(
        "<b>Title Japanese</b>",
        checkValue(item.title_japanese),
        divPara
      );
      createPara("<b>Season</b>", checkValue(item.season), divPara);
      createPara("<b>Year</b>", checkValue(item.year), divPara);
      createPara("<b>Genres</b>", checkValue(genresNames), divPara);
      createPara("<b>Rating</b>", checkValue(item.rating), divPara);
   
    }
  }
};
function checkValue(value) {
  return value === null ? "-" : value;
}
const createPara = (intro, info, parent) => {
  const para = document.createElement("p");
  para.innerHTML = `${intro} : ${info}`;
  parent.appendChild(para);
};
const createIm = (info, parent) => {
  const img = document.createElement("img");
  img.src = info;
  img.className = "m-3 rounded-lg align-middle";
  parent.appendChild(img);
};
