// global variables
let level, answer, score;
const levelArr = document.getElementsByName("level");
const scoreArr = []; // will store objects: { score: number, name: string }
// DOM element references (stable, script loaded with defer)
const dateEl = document.getElementById('date');
const playBtn = document.getElementById('playBtn');
const guessBtn = document.getElementById('guessBtn');
const guess = document.getElementById('guess');
const giveUp = document.getElementById('giveUp');
const msg = document.getElementById('msg');
const wins = document.getElementById('wins');
const avgScore = document.getElementById('avgScore');
const lastVerdict = document.getElementById('lastVerdict');
// round timer state
const roundTimerEl = document.getElementById('roundTimer');
let roundSeconds = 0;
let roundTimerInterval = null;
const fastestTimeEl = document.getElementById('fastestTime');
const avgTimeEl = document.getElementById('avgTime');

// timing storage
const gameTimes = []; // seconds
let lastDuration = null;

function formatTime(s){
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${mm}:${ss}`;
}

function startRoundTimer(){
    roundSeconds = 0;
    if (roundTimerEl) roundTimerEl.textContent = 'Round time: ' + formatTime(roundSeconds);
    if (roundTimerInterval) clearInterval(roundTimerInterval);
    roundTimerInterval = setInterval(()=>{
        roundSeconds++;
        if (roundTimerEl) roundTimerEl.textContent = 'Round time: ' + formatTime(roundSeconds);
    }, 1000);
}

function stopRoundTimer(){
    if (roundTimerInterval) {
        clearInterval(roundTimerInterval);
        roundTimerInterval = null;
    }
    // capture duration in seconds for this round
    lastDuration = roundSeconds;
    return lastDuration;
}

function resetRoundTimer(){
    stopRoundTimer();
    roundSeconds = 0;
    if (roundTimerEl) roundTimerEl.textContent = 'Round time: 00:00';
}

// Name input (in-page) and UI
const nameInput = document.getElementById('nameInput');
const saveNameBtn = document.getElementById('saveName');
const playerNameEl = document.getElementById('playerName');
let firstName = "";

// ensure Play can't be used until a name is saved
if (playBtn) {
    playBtn.disabled = true;
}

// hook up save name button (safe: does nothing if elements missing)
if (saveNameBtn) {
    saveNameBtn.addEventListener('click', () => {
        const v = nameInput ? nameInput.value.trim() : '';
        if (v) {
            firstName = v.charAt(0).toUpperCase() + v.substring(1).toLowerCase();
            if (playerNameEl) playerNameEl.textContent = 'Player: ' + firstName;
            if (playBtn) playBtn.disabled = false; // enable Play once a name is saved
        } else {
            firstName = '';
            if (playerNameEl) playerNameEl.textContent = '';
            if (playBtn) playBtn.disabled = true; // keep Play disabled when name cleared
        }
    });
}

// initialize time display immediately
updateTime();

// add event listeners for the game controls (only if they exist)
if (playBtn) playBtn.addEventListener("click", play);
if (guessBtn) guessBtn.addEventListener("click", makeGuess);
if (giveUp) giveUp.addEventListener("click", handleGiveUp);

function play(){
    score = 0; //sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false;
    if (giveUp) giveUp.disabled = false;
    guess.disabled = false;
    // start per-round timer
    startRoundTimer();
    for(let i=0; i<levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    }
    msg.textContent = "Guess a number from 1-" + level;
    answer = Math.floor(Math.random()*level)+1;
    //guess.placeholder = answer;
}
function makeGuess(){
    let userGuess = parseInt(guess.value, 10);
    const maxRange = parseInt(level, 10) || 0;
    if(isNaN(userGuess) || userGuess < 1 || userGuess > maxRange){
        msg.textContent = "Enter a Valid #1-" + level;
        return;
    }
    score++; // valid guess add 1 to score

    // correct guess
    if(userGuess === answer){
        // stop the round timer and record duration
        const duration = stopRoundTimer();
        msg.textContent = "You got it, " + (firstName || 'Player') + "! it took you " + score + " tries. Round time: " + formatTime(duration) + ". Press play to play again.";
        updateScore();
        reset();
        return;
    }

    // provide hot/cold feedback based on distance and scaled thresholds
    const diff = Math.abs(userGuess - answer);
    const hotThreshold = Math.max(2, Math.round(maxRange * 0.05));
    const warmThreshold = Math.max(5, Math.round(maxRange * 0.10));
    const coolThreshold = Math.max(10, Math.round(maxRange * 0.20));
    let warmth;
    if (diff <= hotThreshold) warmth = 'Hot!';
    else if (diff <= warmThreshold) warmth = 'Warm.';
    else if (diff <= coolThreshold) warmth = 'Cool.';
    else warmth = 'Cold.';

    const direction = userGuess < answer ? 'Too low' : 'Too high';
    msg.textContent = direction + ", " + (firstName || 'Player') + ". " + warmth + " Try again.";
}
function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    playBtn.disabled = false;
    if (giveUp) giveUp.disabled = true;
    // stop and reset round timer
    resetRoundTimer();
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function handleGiveUp(){
    // only allow give up when a game is in progress
    if (typeof level === 'undefined' || level === null) return;
    // convert level to number (radio values are strings)
    const maxRange = parseInt(level, 10) || 0;
    // set the score to the range size (as requested)
    score = maxRange;
    // stop timer and record duration
    const duration = stopRoundTimer();
    msg.textContent = `You gave up, ${firstName || 'Player'}. The answer was ${answer}. Your score is ${score}. Round time: ${formatTime(duration)}.`;
    updateScore();
    reset();
}
function updateScore(){
    // save the score with the player's name (or 'Anonymous' if none)
    const player = firstName && firstName.length ? firstName : 'Anonymous';
    // include duration (seconds) when available so leaderboard can show times
    const entry = { score: score, name: player, duration: (typeof lastDuration === 'number' ? lastDuration : null) };
    scoreArr.push(entry);
    // sort by numeric score ascending
    scoreArr.sort((a,b) => a.score - b.score);
    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Total Wins: " + scoreArr.length;
    let sum = 0;
    for(let i=0; i<scoreArr.length; i++){
        sum += scoreArr[i].score;
        if(i<lb.length){
            // show player name, score and optional round time for the leaderboard entry
            const dur = scoreArr[i].duration;
            lb[i].textContent = scoreArr[i].name + " — " + scoreArr[i].score + (dur ? ` (${formatTime(dur)})` : '');
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);

    // compute a simple verdict for the most recent score: good / okay / bad / awful
    // lower number of tries is better. We compare the player's score to the difficulty range.
    const recent = scoreArr[scoreArr.length - 1];
    if (recent) {
        const maxRange = parseInt(level, 10) || recent.score || 1;
        const pct = recent.score / maxRange;
        let verdict = '';
        if (pct <= 0.2) verdict = 'Good';
        else if (pct <= 0.4) verdict = 'Okay';
        else if (pct <= 0.7) verdict = 'Bad';
        else verdict = 'Awful';
        //if (lastVerdict) lastVerdict.textContent = `${recent.name}'s result: ${verdict}`;
        // also append the verdict to the main message so it's visible immediately after game end
        if (msg) msg.textContent = (msg.textContent ? msg.textContent + ' ' : '') + `${recent.name}'s result: ${verdict}.`;
    }

    // record and display timing stats if the entry included a duration for this round
    if (entry.duration && typeof entry.duration === 'number'){
        gameTimes.push(entry.duration);
        // fastest
        const fastest = Math.min(...gameTimes);
        const sumTimes = gameTimes.reduce((a,b) => a + b, 0);
        const avgT = Math.round(sumTimes / gameTimes.length);
        if (fastestTimeEl) fastestTimeEl.textContent = 'Fastest Time: ' + formatTime(fastest);
        if (avgTimeEl) avgTimeEl.textContent = 'Average Time: ' + formatTime(avgT);
        // clear lastDuration so duplicate pushes don't happen
        lastDuration = null;
    }
}
function updateTime(){
    const now = new Date();

    // Date format: "Nov 6th, 2025" (with ordinal suffix)
    const day = now.getDate();
    // ordinal suffix helper: 1st, 2nd, 3rd, 4th, with 11-13 -> 'th'
    const suffix = (day % 100 >= 11 && day % 100 <= 13) ? 'th' :
        (day % 10 === 1 ? 'st' : (day % 10 === 2 ? 'nd' : (day % 10 === 3 ? 'rd' : 'th')));
    const monthShort = now.toLocaleDateString(undefined, { month: 'short' });
    const year = now.getFullYear();
    const dateStr = `${monthShort} ${day}${suffix}, ${year}`;

    // Time format with seconds, 12-hour clock: "2:34:12 PM"
    const timeStr = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

    if (dateEl) {
        dateEl.textContent = `${dateStr} ${timeStr}`;
    }
}
setInterval(updateTime, 1000);

