import React from 'react';
import logo from './logo.svg';
import './App.css';

const defaultTime = 5;

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
    return (
        <div id="timer-label">
            <h3>Session</h3>
            <h3>{props.timeLeft}</h3>
            <h3>wat</h3>
        </div>
    );
}

const TimerControl = (props) => {
    return (
        <div id="timer-control">
            <button 
              id="start_stop"
              onClick={props.playControl}>
                <i class="fa fa-arrow-up fa-2x" />
            </button>
            <button id="reset" onClick={props.resetTime} >
                <i class="fa fa-arrow-down fa-2x" />
            </button>
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breakTime: 7,
            time: 5,
            mode: "Session",
            counting: false
        };
        this.incrementBreak = this.incrementBreak.bind(this);
        this.decrementBreak = this.decrementBreak.bind(this);
        this.incrementSession = this.incrementSession.bind(this);
        this.decrementSession = this.decrementSession.bind(this);
        this.resetTime = this.resetTime.bind(this);this.startCount = this.startCount.bind(this);
    }
    
    incrementBreak() {
        this.setState({
            breakTime: this.state.breakTime+1
        });
    }
    
    decrementBreak() {
        this.setState({
            breakTime: this.state.breakTime-1
        });
    }
    
    incrementSession() {
        this.setState({
            time: this.state.time+1
        });
    }
    
    decrementSession() {
        this.setState({
            time: this.state.time-1
        });
    }
    
    resetTime() {
        this.setState({
            mode: "Session",
            time: defaultTime
        });
    }
    
    startCount() {
        this.setState({
            counting: !this.state.counting
        });
        let myVar = setInterval(() => {
                if(this.state.counting) {
                    this.setState({time: this.state.time - 1})
                }
            }, 1000);
    }
    
    render() {
        return (
            <div id="container">
                <div id="main-title">25+5 Clock</div>
                <BreakControl time={this.state.breakTime} increase={this.incrementBreak} decrease={this.decrementBreak} />
                <SessionControl time={this.state.time} increase={this.incrementSession} decrease={this.decrementSession} />
                <TimerDisplay timeLeft={this.state.time}/>
                <TimerControl playControl={this.startCount} resetTime={this.resetTime} />
            </div>
        );
    }
}

export default App;
