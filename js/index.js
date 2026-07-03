/* 首頁:讀取 data/quizzes.json,渲染測驗列表。
 * 之後要新增測驗,只要:
 *   1. 在 data/ 放一個新的測驗 JSON(格式同 cat-personality.json)
 *   2. 在 data/quizzes.json 的 quizzes 陣列加一筆
 */
(function () {
  document.getElementById("site-logo").innerHTML = catSVG(defaultCatArt, "logo");

  var listEl = document.getElementById("quiz-list");

  fetch("data/quizzes.json")
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(function (data) {
      listEl.innerHTML = "";
      data.quizzes.forEach(function (q, i) {
        var card = document.createElement("a");
        card.className = "quiz-card";
        card.href = "quiz.html?quiz=" + encodeURIComponent(q.id);
        card.style.animationDelay = i * 0.08 + "s";
        card.innerHTML =
          '<div class="quiz-card-art">' + (q.art ? catSVG(q.art, "card" + i) : "") + "</div>" +
          '<div class="quiz-card-body">' +
          '<div class="quiz-card-title">' + q.title + "</div>" +
          '<div class="quiz-card-desc">' + q.description + "</div>" +
          '<div class="quiz-card-meta">共 ' + q.questionCount + " 題・約 2 分鐘</div>" +
          "</div>" +
          '<div class="quiz-card-go">開始</div>';
        listEl.appendChild(card);
      });
    })
    .catch(function () {
      listEl.innerHTML = '<p class="loading">測驗列表載入失敗,請稍後再試 🙀</p>';
    });
})();
