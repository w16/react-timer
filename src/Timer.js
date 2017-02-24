import React, { Component, PropTypes } from 'react';

// Types
const REGULAR_TYPE = 'regular';
const COUNTDOWN_TYPE = 'countdown';

// Patterns
const DEFAULT_PATTERN = 'hh:mm:ss';

// Tick Lengths
const ONE_SECOND_TICK = 1000;
const ONE_MINUTE_TICK = 60 * ONE_SECOND_TICK;
const ONE_HOUR_TICK = 60 * ONE_MINUTE_TICK;

// States
const STOPPED_STATE = 'stopped';
const STARTED_STATE = 'started';
const READY_TO_START_STATE = 'ready_start';
const READY_TO_STOP_STATE = 'ready_stop';

// Time
const DEFAULT_TIME = '00:00:00';

let TIMER_OBJ = null;

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      currentState: STOPPED_STATE
    };

    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.renderTimer = this.renderTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.convertStartTimeToCounter = this.convertStartTimeToCounter.bind(this);
  }

  componentWillMount() {
    this.convertStartTimeToCounter();
  }

  componentDidMount() {
    const { currentState } = this.state;
    if (currentState === READY_TO_START_STATE) {
      this.startTimer();
    } else if (currentState === READY_TO_STOP_STATE) {
      this.stopTimer();
    }
  }

  convertStartTimeToCounter() {
    //TODO Convert StartTime String to millis and put in counter
  }

  startTimer() {
    const { tick } = this.tick;
    this.setState({ currentState: STARTED_STATE });
    TIMER_OBJ = setTimeout(() => { tick(); }, this.props.tickLength);
    if (this.props.onStart) {
      this.props.onStart();
    }
  }

  stopTimer() {
    this.setState({ currentState: STOPPED_STATE, counter: 0 });
    if (!TIMER_OBJ) {
      clearTimeout(TIMER_OBJ);
    }
    if (this.props.onStop) {
      this.props.onStop();
    }
  }

  tick() {
    const { counter, currentState } = this.state;
    const { tickLength, onTick } = this.props;
    const { tick } = this.tick;
    if (currentState === STARTED_STATE) {
      const newCounter = counter + tickLength;
      this.setState({ counter: newCounter });
      if (onTick) {
        onTick();
      }
      TIMER_OBJ = setTimeout(() => { tick(); }, tickLength);
    }
  }

  renderTimer() {
    //TODO Convert counter to pattern and return the result string
  }

  render() {
    const { onClick, onMouseOver } = this.props;
    return (
      <span
        onClick={onClick}
        onMouseOver={onMouseOver}
      >
        {this.renderTimer()}
      </span>
    );
  }
}

Timer.defaultProps = {
  tickLength: ONE_SECOND_TICK,
  pattern: DEFAULT_PATTERN,
  type: REGULAR_TYPE
};

Timer.propTypes = {
  tickLength: PropTypes.number,
  pattern: PropTypes.string,
  type: PropTypes.string,
  startTime: PropTypes.string,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
  onTick: PropTypes.func,
  onComplete: PropTypes.func,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onExit: PropTypes.func,
};

export default Timer;

export const Type = {
  regular: REGULAR_TYPE,
  countdown: COUNTDOWN_TYPE,
  default: REGULAR_TYPE
};

export const Pattern = {
  default: DEFAULT_PATTERN
};

export const Tick = {
  oneSecond: ONE_SECOND_TICK,
  oneMinute: ONE_MINUTE_TICK,
  oneHour: ONE_HOUR_TICK,
  default: ONE_SECOND_TICK
};

export const Time = {
  default: DEFAULT_TIME
};
