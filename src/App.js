import React from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_SESSION_TIME = 25;    // In minutes
const DEFAULT_BREAK_TIME = 5;       // In minutes
const TIME_LIMIT_H = 60;            // In minutes
const TIME_LIMIT_L = 1;             // In minutes

const BreakControl = (props) => {
    return (
        <div id="break-label">
            <h3>Break Length</h3>
            <button id="break-decrement" onClick={props.decrease} >
                <i class="fa fa-arrow-down fa-fw"></i>
            </button>
            <div id="break-length">{props.time}</div>
            <button id="break-increment" onClick={props.increase} >
                <i class="fa fa-arrow-up fa-fw"></i>
            </button>
        </div>
    );
}

const SessionControl = (props) => {
    return (
        <div id="session-label">
            <h3>Session Length</h3>
            <button id="session-decrement" onClick={props.decrease} >
                <i class="fa fa-arrow-down fa-fw"></i>
            </button>
            <div id="session-length">{props.time}</div>
            <button id="session-increment" onClick={props.increase} >
                <i class="fa fa-arrow-up fa-fw"></i>
            </button>
        </div>
    );
}

const TimerDisplay = (props) => {
    let minutes = parseInt(props.timeLeft/60).toString();
    let seconds = (props.timeLeft % 60).toString();
    if (minutes.length < 2) {
        minutes = "0"+minutes
    }
    if (seconds.length < 2) {
        seconds = "0"+seconds
    }
    return (
        <div id="timer-label">
            <h3>{props.mode}</h3>
            <h3 id="time-left">{minutes+":"+seconds}</h3>
        </div>
    );
}

const TimerControl = (props) => {
    return (
        <div id="timer-control">
            <button 
              id="start_stop"
              onClick={props.playControl}>
                <i class="fa fa-power-off fa-2x" />
            </button>
            <button id="reset" onClick={props.resetTime} >
                <i class="fas fa-redo fa-2x" />
            </button>
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breakTime: 3,
            time: 1500,                         // Unit of seconds
            initBreak: DEFAULT_BREAK_TIME,      // Unit of minutes
            initSession: DEFAULT_SESSION_TIME,  // Unit of minutes
            mode: "Session",
            timerId: '',
            counting: false
        };
        this.incrementBreak = this.incrementBreak.bind(this);
        this.decrementBreak = this.decrementBreak.bind(this);
        this.incrementSession = this.incrementSession.bind(this);
        this.decrementSession = this.decrementSession.bind(this);
        this.resetTime = this.resetTime.bind(this);
        this.handleCount = this.handleCount.bind(this);
        this.timer = this.timer.bind(this);
    }
    
    incrementBreak() {
        if (!this.state.counting && this.state.initBreak < TIME_LIMIT_H) {
            this.setState({
                initBreak: this.state.initBreak+1
            });
            if (this.state.mode === "Break") {
                this.setState({
                    time: (this.state.initBreak+1)*60
                });
            }
        }
    }
    
    decrementBreak() {
        if (!this.state.counting && this.state.initBreak > TIME_LIMIT_L) {
            this.setState({
                initBreak: this.state.initBreak-1
            });
            if (this.state.mode === "Break") {
                this.setState({
                    time: (this.state.initBreak-1)*60
                });
            }
        }
    }
    
    incrementSession() {
        if (!this.state.counting && this.state.initSession < TIME_LIMIT_H) {
            this.setState({
                initSession: this.state.initSession+1
            });
            if (this.state.mode === "Session") {
                this.setState({
                    time: (this.state.initSession+1)*60
                });
            }
        }
    }
    
    decrementSession() {
        if (!this.state.counting && this.state.initSession > TIME_LIMIT_L) {
            this.setState({
                initSession: this.state.initSession-1,
                time: this.state.initSession
            });
            if (this.state.mode === "Session") {
                this.setState({
                    time: (this.state.initSession-1)*60
                });
            }
        }
    }
    
    resetTime() {
        const sound = document.getElementById("beep");
        sound.pause();
        sound.currentTime = 0;
        this.setState({
            mode: "Session",
            counting: false,
            time: DEFAULT_SESSION_TIME*60,
            initBreak: DEFAULT_BREAK_TIME,
            initSession: DEFAULT_SESSION_TIME
        });
        if (this.state.timerId) {
          clearInterval(this.state.timerId);
        }
    }
    
    handleCount() {
        if (!this.state.counting) {
            console.log("start/resume timer");
            this.timer();
            this.setState({
                counting: ~this.state.counting
            });
        } else {
            console.log("stop timer");
            if (this.state.timerId) {
                clearInterval(this.state.timerId);
            }
            this.setState({
                counting: ~this.state.counting
            });
        }
    }
    
    timer() {
        if (this.state.mode === "Session") {
            let currentTimer = setInterval(() => {
                if (this.state.time > 0) {
                    this.setState({
                        time: this.state.time-1
                    });
                } else {
                    this.setState({
                        mode: "Break",
                        time: this.state.initBreak*60
                    });
                    let sound = document.getElementById("beep");
                    sound.play();
                    clearInterval(this.state.timerId);
                    this.timer();
                }
            }, 1000);
            this.setState({
                timerId: currentTimer
            });
        } else {
            let currentTimer = setInterval(() => {
                if (this.state.time > 0) {
                    this.setState({
                        time: this.state.time-1
                    });
                } else {
                    clearInterval(this.state.timerId);
                    this.setState({
                        mode: "Session",
                        time: this.state.initSession*60
                    });
                    let sound = document.getElementById("beep");
                    sound.play();
                    this.timer();
                }
            }, 1000);
            this.setState({
                timerId: currentTimer
            });
        }
    }
    
    render() {
        return (
            <div id="container">
                <div id="main-title">25+5 Clock</div>
                <BreakControl time={this.state.initBreak} increase={this.incrementBreak} decrease={this.decrementBreak} />
                <SessionControl time={this.state.initSession} increase={this.incrementSession} decrease={this.decrementSession} />
                <TimerDisplay timeLeft={this.state.time} mode={this.state.mode} />
                <TimerControl playControl={this.handleCount} resetTime={this.resetTime} />
                <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
            </div>
        );
    }
}

export default App;
