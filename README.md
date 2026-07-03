# 毛毛心理測驗所 🐾

純前端靜態心理測驗網站,手機優先設計,適合在 LINE 群組轉發。

## 檔案結構

```
├── index.html              # 首頁(測驗列表)
├── quiz.html               # 測驗頁(共用,靠 ?quiz=<id> 決定載入哪個測驗)
├── css/style.css           # 全站樣式(奶茶色系)
├── js/
│   ├── cat-art.js          # SVG 貓咪插圖產生器
│   ├── index.js            # 首頁邏輯
│   └── quiz.js             # 測驗邏輯(答題、計分、分享)
├── data/
│   ├── quizzes.json        # 測驗列表(首頁讀這個)
│   └── cat-personality.json # 「你是哪種貓咪?」題目與結果
└── server.ps1              # 本地預覽用的靜態伺服器
```

## 本地預覽

```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```

然後開瀏覽器到 http://localhost:8080

(不能直接雙擊 index.html 開啟,因為瀏覽器擋 file:// 的 fetch,JSON 會載不進來。)

## 如何新增一個測驗

1. 在 `data/` 新增一個 JSON,例如 `data/dog-personality.json`,格式照抄 `cat-personality.json`:
   - `questions[]`:每題有 `text` 和 4 個 `options`,每個選項的 `scores` 對 1~2 種類型加分
   - `results{}`:每種結果有 `name`、`tagline`、`description`、`friend`、`rival`、`weight`(平手時權重大的優先,稀有類型設大一點)、`art`(貓咪外觀設定)
2. 在 `data/quizzes.json` 的 `quizzes` 陣列加一筆(`id` 要和檔名一致)
3. 完成!首頁會自動多出一張測驗卡片

## 修改測驗內容

題目、選項、計分、12 種結果的文案全部都在 `data/cat-personality.json`,直接改存檔即可,不用動任何程式碼。

## 部署到 GitHub Pages

1. 在 GitHub 開一個新 repo(例如 `cat-quiz`),**Public**
2. 在這個資料夾執行:

   ```powershell
   git init
   git add .
   git commit -m "心理測驗網站初版"
   git branch -M main
   git remote add origin https://github.com/<你的帳號>/cat-quiz.git
   git push -u origin main
   ```

3. 到 repo 的 **Settings → Pages**:
   - Source 選 **Deploy from a branch**
   - Branch 選 **main**、資料夾選 **/(root)**,按 Save
4. 等 1~2 分鐘,網站就會出現在:
   `https://<你的帳號>.github.io/cat-quiz/`

之後每次修改只要 `git add . → git commit → git push`,幾分鐘內自動更新。

把網址貼到 LINE 群組就能玩了 🎉
