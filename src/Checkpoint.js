import { Component, PropTypes } from 'react';
import moment from 'moment';

import {
  TimePropType,
  Tick,
  Pattern,
  Limit
} from './Timer';

export const UNLIMITED_REPEATS = -1;

class Checkpoint extends Component {
  constructor(props) {
    super(props);

    this.state = { interval: Tick.oneMinute };
  }

  componentDidMount() {
    this.setState({ interval: convertTimeToMillis(this.props.interval) });
  }

  render() {
    return null;
  }
}

const convertTimeToMillis = (time) => {
  if (time) {
    const milis = moment(time, `${Pattern.default}`).millis();
    return milis;
  }

  return null;
};

Checkpoint.propTypes = {
  maxRepeats: PropTypes.number,
  repeat: PropTypes.bool,
  interval: TimePropType,
  onCheckpoint: PropTypes.func.isRequired
};

Checkpoint.defaultProps = {
  maxRepeats: Limit.unlimited,
  repeat: true,
  interval: '00:01:00'
};

export default Checkpoint;
