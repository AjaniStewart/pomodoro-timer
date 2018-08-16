//Timer durations defaults
let pomodoroDuration = 25 * 60 * 1000; //25 mins
let shortBreakDuration = 5 * 60 * 1000; //5 mins
let longBreakDuration = 10 * 60 * 1000; //10 mins

//main functions
let alarmAudio = new Audio("assests/sounds/alarm.wav");
let currentTimerId = 0;
let timerActive = false;

function startTimer(duration) {
    duration -= 1000;
    timerActive = true;
    changeButtonLabel();
    currentTimerId += 1;
    currentTimerId = setInterval(() => { 
        displayTimeLeft(duration);
        if (duration < 1000) {
            stopTimer(currentTimerId);
            alarmAudio.play();
        }
        duration -= 1000;
    } ,1000);
}

const countdownContainer = document.querySelector(".countdown");

function displayTimeLeft(end) {
    let mins = Math.floor(end / 60000);
    end = end % 60000;
    let secs = Math.floor(end / 1000);
    countdownContainer.textContent = `${formatTime(mins)}:${formatTime(secs)}`;
}

function stopTimer(timer) {
    timerActive = false;
    changeButtonLabel();
    clearInterval(timer);
}

function resumeTimer() {
    let timeString = countdownContainer.textContent;
    let mins = parseInt(timeString.slice(0,2));
    let secs = parseInt(timeString.slice(3,5));
    let duration = (mins * 60 * 1000) + (secs * 1000);
    return startTimer(duration);
}

function formatTime(n) {
    return n < 10 ? "0" + n : n;
}

function switchTimer(duration) {
    stopTimer(currentTimerId);
    displayTimeLeft(duration);
    startTimer(duration);
}

let currentActiveTab = "pomodoro";
const shortBreakTab = document.querySelector("#short_break");
const longBreakTab = document.querySelector("#long_break");
const pomodoroTab = document.querySelector("#pomodoro");

function switchTab(tab) {
    currentActiveTab = tab;
    switch (tab) {
        case "pomodoro":
            switchTimer(pomodoroDuration);
            shortBreakTab.classList.remove("active");
            longBreakTab.classList.remove("active");
            pomodoroTab.classList.add("active");
            break;

        case "short_break":
            switchTimer(shortBreakDuration);
            longBreakTab.classList.remove("active");
            pomodoroTab.classList.remove("active");
            shortBreakTab.classList.add("active");
            break;

        case "long_break":
            switchTimer(longBreakDuration);
            pomodoroTab.classList.remove("active");
            shortBreakTab.classList.remove("active");
            longBreakTab.classList.add("active");
            break;
    }
}

function resetTimer() {
    switchTab(currentActiveTab);
    stopTimer(currentTimerId);
}

function startOrPauseTimer() {
    if (timerActive) {
        stopTimer(currentTimerId);
    } else {
        resumeTimer();
    }
}

function changeButtonLabel() {
    if (timerActive) {
        startPauseButton.textContent = "Pause";
        startPauseButton.style.background = "red";
    } else {
        startPauseButton.textContent = "Start"
        startPauseButton.style.background = "green";
    }
}
//event listeners
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.addEventListener("click", e => {
        switchTab(e.srcElement.id);
    });
});

const startPauseButton = document.querySelector(".start_pause");
startPauseButton.addEventListener("click", startOrPauseTimer);

const resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", resetTimer);

const editButton = document.querySelector(".edit");
editButton.addEventListener("click", () => {
    let currentTab;
    switch (currentActiveTab) {
        case "pomodoro":
            currentTab = "Pomodoro"
            break;
    
        case "short_break":
            currentTab = "Short Break";
            break;

        case "long_break":
            currentTab = "Long Break";
    }
    let input = prompt(`Enter new time for ${currentTab}. (format: xx:xx)`);
    if (input !== null) {
        if (/^\d\d:[0-5]\d$/.test(input)) {
            let mins = parseInt(input.slice(0,2));
            let secs = parseInt(input.slice(3,5));
            let newDuration = (mins * 60 * 1000) + (secs * 1000);
            switch (currentActiveTab) {
                case "pomodoro":
                    pomodoroDuration = newDuration;
                    break;
                
                case "short_break":
                    shortBreakDuration = newDuration;
                    break;

                case "long_break":
                    longBreakDuration = newDuration;
            }
            resetTimer();
        } else {
            alert("Invalid time entered");
        }
    }
});
//keyboard support
//shift-p -> pomodoro
//shift-l -> long break
//shift-s -> short break
//shift-r -> reset
//space -> pause/resume
window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 32: //space
            startOrPauseTimer(); break;
        case 80: //p
            if (e.shiftKey) { switchTab("pomodoro"); } break;
        case 76: //l
            if (e.shiftKey) { switchTab("long_break") } break;
        case 83: //s
            if (e.shiftKey) { switchTab("short_break"); } break;
        case 82: //r
            if (e.shiftKey) { resetTimer(); } break;
    }
});
