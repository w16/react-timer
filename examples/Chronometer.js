import React, { Component } from 'react';

import Timer, { Tick, Pattern, Time, Type } from '../src/Timer';

class Chronometer extends Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
  }

  handleEvent(label) {
    this.setState({
      events: [...this.state.events, `'${label}' fired!`]
    });
  }

  render() {
    const events = this.state.events.map((event, i) =>
      <div key={i}>{event}</div>
    );

    return (
      <div>
        <div>
          <Timer
            ref="timer"
            tickLength={Tick.default}
            pattern={Pattern.default}
            type={Type.default}
            startTime={Time.default}
            onStart={this.handleEvent.bind(this, 'onStart')}
            onStop={this.handleEvent.bind(this, 'onStop')}
            onTick={this.handleEvent.bind(this, 'onTick')}
            onComplete={this.handleEvent.bind(this, 'onComplete')}
            onClick={this.handleEvent.bind(this, 'onClick')}
            onMouseOver={this.handleEvent.bind(this, 'onMouseOver')}
            onExit={this.handleEvent.bind(this, 'onExit')}
          />
        </div>
        <div>
          <button onClick={() => this.refs.timer.startTimer()}>Start</button>
          <button onClick={() => this.refs.timer.stopTimer()}>Stop</button>
          <button onClick={() => this.refs.timer.clear()}>Clear</button>
        </div>
        <div>
          {events}
        </div>
      </div>
    );
  }
}

export default Chronometer;
