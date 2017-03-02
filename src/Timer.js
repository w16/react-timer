import React, { Component, PropTypes } from 'react';
import moment from 'moment';

// Types
const REGULAR_TYPE = 'regular';
const COUNTDOWN_TYPE = 'countdown';

// Patterns
const DEFAULT_PATTERN = 'HH:mm:ss';
const DATE_PATTERN = 'DD/MM/YYYY';

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
const DEFAULT_DATE = moment().format(DATE_PATTERN);

// Limit
const COUNTDOWN_LIMIT = 0;

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
    this.clear = this.clear.bind(this);
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
    if (this.props.onExit) {
      window.onbeforeunload = this.props.onExit; // eslint-disable-line no-undef
    }
  }

  componentWillUnmount() {
    if (this.props.onExit) {
      window.onbeforeunload = null; // eslint-disable-line no-undef
    }
  }

  convertStartTimeToCounter() {
    const start = this.props.startTime;
    this.setState({
      counter: this.convertTimeToMillis(`${DEFAULT_DATE} ${start}`)
    });
  }

  convertTimeToMillis(time) {
    if (time) {
      const milis = moment(time, `${DATE_PATTERN} ${DEFAULT_PATTERN}`).valueOf();
      return milis;
    }

    return null;
  }

  startTimer() {
    if (this.state.currentState !== STARTED_STATE) {
      const tick = this.tick;
      this.setState({ currentState: STARTED_STATE });
      TIMER_OBJ = setTimeout(() => { tick(); }, this.props.tickLength);
      if (this.props.onStart) {
        this.props.onStart();
      }
    }
  }

  stopTimer() {
    this.setState({ currentState: STOPPED_STATE });
    if (!TIMER_OBJ) {
      clearTimeout(TIMER_OBJ);
    }
    if (this.props.onStop) {
      this.props.onStop();
    }
  }

  clear() {
    this.setState({ currentState: STOPPED_STATE });
    this.convertStartTimeToCounter();
    if (!TIMER_OBJ) {
      clearTimeout(TIMER_OBJ);
    }
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  }

  tick() {
    const { counter, currentState } = this.state;
    const {
      tickLength,
      onTick,
      type,
      limit,
      startTime,
      onComplete
    } = this.props;
    const tick = this.tick;

    if (currentState === STARTED_STATE) {
      let value = tickLength;
      let limitValue = this.convertTimeToMillis(limit);
      if (type === COUNTDOWN_TYPE) {
        value *= -1;
        if (!limitValue ||
          limitValue < COUNTDOWN_LIMIT ||
          limitValue > this.convertTimeToMillis(startTime)) {
          limitValue = COUNTDOWN_LIMIT;
        }
      }

      const newCounter = counter + value;

      if ((type === COUNTDOWN_TYPE && newCounter > limitValue) ||
          (type === REGULAR_TYPE &&
          (newCounter < limitValue || !limitValue))) {
        this.setState({ counter: newCounter });
        if (onTick) {
          onTick();
        }
        TIMER_OBJ = setTimeout(() => { tick(); }, tickLength);
      } else {
        this.stopTimer();
        if (onComplete) {
          onComplete();
        }
      }
    }
  }

  render() {
    const { onClick, onMouseOver, className, style } = this.props;
    return (
      <span
        style={style}
        className={className}
        onClick={onClick}
        onMouseOver={onMouseOver}
      >
        {moment(this.state.counter).format(this.props.pattern)}
      </span>
    );
  }
}

// https://www.ian-thomas.net/custom-proptype-validation-with-react/
const timePropType = (props, propName, componentName) => {
  if (props[propName]) {
    const value = props[propName];
    return moment(value, DEFAULT_PATTERN).isValid() ?
      null :
      new Error(`${propName} in ${componentName} is invalid!
        Input time data must have 'HH:mm:ss' pattern!`);
  }

  return null;
};

Timer.defaultProps = {
  tickLength: ONE_SECOND_TICK,
  pattern: DEFAULT_PATTERN,
  type: REGULAR_TYPE,
  startTime: DEFAULT_TIME
};

Timer.propTypes = {
  tickLength: PropTypes.number,
  pattern: PropTypes.string,
  type: PropTypes.oneOf([REGULAR_TYPE, COUNTDOWN_TYPE]),
  limit: timePropType,
  startTime: timePropType,
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
