[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/QBVILCJc)
# 🎯 AP Computer Science Principles Project: JavaScript Number Guessing Game

## 📘 Overview
In this project, you’ll design and code a **JavaScript Number Guessing Game** that runs entirely in the browser.

The game should allow the user to:
- Select a difficulty level
- Enter guesses until they get the correct number or **Give Up**
- Track and display statistics like **total wins**, **average score**, **leaderboard**, **fastest game**, and **average time per game**
- Show the **current date and time** (continuously updating with seconds, correct month name, and day suffix)

Your HTML elements, variable names, and function names must match the specifications below exactly.

---

## 🗂️ Required Files
Your repository **must include** these two files in the root directory:

```
index.html
script.js
```
---

## 🧩 HTML Structure

The project relies on specific **IDs** and **element names**. Make sure these match exactly, including capitalization.

### Elements
| Feature | HTML Tag | ID / name | Notes |
|----------|-----------|------------|-------|
| Display current date and time | `<p>` | `id="date"` | Must show formatted date with month name + suffix and live time with seconds |
| Level selector | `<input type="radio" name="level" id="e" value="3">` | name must be `"level"` | Include **three** levels: Easy, Medium, Hard |
| Play button | `<button>` | `id="playBtn"` | Starts the game and generates random answer |
| Guess input | `<input>` | `id="guess"` | User types their guess here |
| Guess button | `<button>` | `id="guessBtn"` | Submits the current guess |
| **Give Up** button | `<button>` | `id="giveUpBtn"` | Ends the round immediately and sets score to the range |
| Message area | `<h3>` | `id="msg"` | Displays feedback (“Too high”, “Correct”, etc.) and qualitative score |
| Wins display | `<p>` | `id="wins"` | Shows total number of games won |
| Average score display | `<p>` | `id="avgScore"` | Shows average number of guesses per win |
| Leaderboard list | `<ol>` | child `<li name="leaderboard">` | Must contain at least three `<li>` items |
| Fastest game display | `<p>` | `id="fastest"` | Show fastest round time |
| Average time per game | `<p>` | `id="avgTime"` | Show average time across all games |

### Example Base HTML
> You may copy this into your `index.html` as a starting point.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Number Guessing Game</title>
    <script src="script.js" defer></script>
  </head>
  <body>
    <p id="date"></p>

    <h3>Level</h3>
    <input type="radio" name="level" id="e" value="3" checked><label for="e">Easy</label>
    <input type="radio" name="level" id="m" value="10"><label for="m">Medium</label>
    <input type="radio" name="level" id="h" value="100"><label for="h">Hard</label>

    <button id="playBtn">Play</button>

    <h3 id="msg">Select a Level</h3>
    <input type="text" id="guess">
    <button id="guessBtn" disabled>Guess</button>
    <button id="giveUp" disabled>Give Up</button>

    <h3>Stats</h3>
    <p id="wins">Total wins: 0</p>
    <p id="avgScore">Average Score: </p>

    <h3>Leaderboard</h3>
    <ol>
      <li name="leaderboard">100</li>
      <li name="leaderboard">100</li>
      <li name="leaderboard">100</li>
    </ol>
  </body>
</html>
```

---

## ⚙️ JavaScript Functions and Variables

Use these **exact** function and variable names.

### Functions
| Function | Description | Notes |
|-----------|--------------|-------|
| `time()` | Returns formatted date and time as a string | Must use `Date()`, month **name**, and day **suffix** (e.g., `March 1st, 2025, 2:30:45 PM`) |
| `play()` | Starts a new game | 1) Sets `answer` to random 1..level 2) Enables inputs/buttons 3) Disables Play & level radios 4) Displays “Guess a #1–(level)” and records `startMs` |
| `makeGuess()` | Handles user guess | Compares input to `answer`, shows hot/warm/cold, tracks guesses and win |
| `updateScore()` | Updates total wins, average score, leaderboard | Sort scores ascending; display top 3 |
| `updateTimers(endMs)` | Updates fastest and averages | Add `(endMs - startMs)` to totals; update fastest/avg |
| `reset()` | Resets controls for next round | Re-enables level radios and Play button |
| `giveUp()` | Ends the round immediately | Sets score to `level` (range value), updates stats/timers |

### Event Listeners
```js
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);
```

---

## 🧮 Minimum Requirements (70 points)

- **A working guessing game**
- **Games won**
- **Average score**
- **A leaderboard** (at least top 3)
- **At least three levels**
- **Current date and time**

Additional behaviors **(3 points each**):
- Ask the user for their name, **case it correctly**, and use it in all messages (make them enter something)
- Let the user **give up** and set their score to the range
- Tell the user if they are **cold, warm, hot**, etc. (using absolute difference)
- Tell the user if their score was **good, bad, ok**, etc.
- **Add month name and suffix** to the date correctly (e.g., March 1st; July 2nd; June 3rd; May 31st)
- **Update the time every second** (show the seconds)
- **Keep a timer for the round** (`Date.getTime()`) and **fastest game** played
- Keep a **timer for all games** and display the **average time per game**

**Above and Beyond (+6 points):** add clearly documented extra features not listed above.

---

## 🧭 Tips for Success
- Test manually as you build: play a round, verify stats update, try give up, verify leaderboard.
- Use `console.log()` for debugging.
- Keep IDs and function names **exact**.
- For date suffixes, handle `1st, 2nd, 3rd, 4th...`, and the special-case `11th, 12th, 13th`.

---

## 🏁 Submission
1. **Commit and push** your `index.html`, `script.js`, and `README.md` to your GitHub repository.
2. **Enable GitHub Pages**:
   - Go to **Repository → Settings → Pages**.
   - Under **Build and deployment**, choose **Deploy from a branch**.
   - Select your default branch (usually `main`) and `/ (root)` for the folder.
   - Click **Save** and wait for the site to publish (you’ll see a link at the top of the Pages section).
3. **Verify your live page** works: open the GitHub Pages URL and test the game in your browser.
4. **Submit the GitHub Pages link** to the assignment on **Google Classroom**.
