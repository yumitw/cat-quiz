/* 測驗頁:依網址 ?quiz=<id> 載入 data/<id>.json,
 * 跑完 12 題後計分:
 *   - 每個選項對 1~2 種類型加分(scores)
 *   - 取總分最高者;平手時比 results[type].weight(越大越優先,稀有類型權重高)
 */
(function () {
  var params = new URLSearchParams(location.search);
  var quizId = params.get("quiz");

  var screens = {
    start: document.getElementById("screen-start"),
    question: document.getElementById("screen-question"),
    result: document.getElementById("screen-result")
  };

  var quiz = null;
  var current = 0;
  var totals = {};
  var locked = false; // 防止動畫期間連點

  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].hidden = k !== name;
    });
  }

  function fail(msg) {
    document.getElementById("error-box").hidden = false;
    document.getElementById("error-box").innerHTML =
      msg + '<br><br><a class="btn btn-ghost" href="./">回測驗列表</a>';
  }

  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  if (!quizId) { fail("找不到這個測驗 🙀"); return; }

  fetch("data/" + encodeURIComponent(quizId) + ".json")
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(function (data) {
      quiz = data;
      document.title = quiz.title + "|毛毛心理測驗所";
      document.getElementById("quiz-title").textContent = quiz.title;
      document.getElementById("quiz-desc").textContent = quiz.description;
      if (quiz.startArt) {
        document.getElementById("start-art").innerHTML = catSVG(quiz.startArt, "start");
      }
      show("start");
    })
    .catch(function () { fail("測驗載入失敗,請稍後再試 🙀"); });

  document.getElementById("btn-start").addEventListener("click", startQuiz);
  document.getElementById("btn-retry").addEventListener("click", startQuiz);
  document.getElementById("btn-share").addEventListener("click", share);

  function startQuiz() {
    current = 0;
    totals = {};
    locked = false;
    show("question");
    window.scrollTo(0, 0);
    renderQuestion();
  }

  function renderQuestion() {
    var q = quiz.questions[current];
    var total = quiz.questions.length;

    document.getElementById("progress-label").textContent =
      "第 " + (current + 1) + " 題 / 共 " + total + " 題";
    document.getElementById("progress-fill").style.width =
      ((current + 1) / total) * 100 + "%";

    var card = document.getElementById("question-card");
    card.classList.remove("slide-in");
    void card.offsetWidth; // 重新觸發動畫
    card.classList.add("slide-in");

    document.getElementById("question-text").textContent = q.text;

    var box = document.getElementById("options");
    box.innerHTML = "";
    q.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = opt.text;
      btn.addEventListener("click", function () { pick(btn, opt); });
      box.appendChild(btn);
    });
    locked = false;
  }

  function pick(btn, opt) {
    if (locked) return;
    locked = true;
    btn.classList.add("picked");

    Object.keys(opt.scores).forEach(function (type) {
      totals[type] = (totals[type] || 0) + opt.scores[type];
    });

    // 給一點點擊回饋時間再進下一題
    setTimeout(function () {
      current++;
      if (current < quiz.questions.length) {
        renderQuestion();
      } else {
        showResult(computeResult());
      }
    }, 320);
  }

  function computeResult() {
    var best = null;
    Object.keys(totals).forEach(function (type) {
      if (!quiz.results[type]) return;
      var score = totals[type];
      var weight = quiz.results[type].weight || 0;
      if (!best || score > best.score || (score === best.score && weight > best.weight)) {
        best = { type: type, score: score, weight: weight };
      }
    });
    return best ? best.type : Object.keys(quiz.results)[0];
  }

  function showResult(type) {
    var r = quiz.results[type];
    document.getElementById("result-art").innerHTML = catSVG(r.art, "result");
    document.getElementById("result-name").textContent = r.name;
    document.getElementById("result-tagline").textContent = r.tagline;
    document.getElementById("result-desc").textContent = r.description;
    document.getElementById("result-friend").textContent = r.friend;
    document.getElementById("result-rival").textContent = r.rival;
    document.getElementById("result-cta").textContent = quiz.resultCta;
    document.getElementById("btn-share").dataset.result = r.name + "|" + r.tagline;
    show("result");
    window.scrollTo(0, 0);
  }

  function share() {
    var resultName = document.getElementById("btn-share").dataset.result || "";
    var url = location.origin + location.pathname + "?quiz=" + encodeURIComponent(quizId);
    var text = (quiz.shareText || "").replace("{result}", resultName);

    if (navigator.share) {
      navigator.share({ title: quiz.shareTitle || quiz.title, text: text, url: url })
        .catch(function () { /* 使用者取消分享,不用處理 */ });
    } else {
      copyLink(text + "\n" + url);
    }
  }

  function copyLink(content) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(content).then(
        function () { toast("已複製連結,快貼給朋友吧!"); },
        function () { legacyCopy(content); }
      );
    } else {
      legacyCopy(content);
    }
  }

  function legacyCopy(content) {
    var ta = document.createElement("textarea");
    ta.value = content;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      toast("已複製連結,快貼給朋友吧!");
    } catch (e) {
      toast("複製失敗,請手動複製網址");
    }
    document.body.removeChild(ta);
  }
})();
