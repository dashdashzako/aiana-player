import * as React from 'react';
import { connect } from 'react-redux';
import { IAianaState } from 'src/reducers';
import { BufferedRanges } from 'src/utils/media';
import StyledTimeRanges from './Styles';

interface IStateProps {
  bufferedRanges: BufferedRanges;
  duration: number;
}

const { floor } = Math;

const TimeRangesBar: React.SFC<IStateProps> = ({
  bufferedRanges,
  duration
}) => (
  <StyledTimeRanges className="aip-buffered">
    <svg
      width="100%"
      height="1em"
      viewBox={`0 0 ${floor(duration)} 10`}
      preserveAspectRatio="none"
    >
      {bufferedRanges.map(({ end, start }, idx) => (
        <path key={idx} d={`M${start} 0 H${end} V10 H${start} z`} />
      ))}
    </svg>
  </StyledTimeRanges>
);

const mapStateToProps = (state: IAianaState) => ({
  bufferedRanges: state.player.bufferedRanges,
  duration: state.player.duration
});

export default connect(mapStateToProps)(TimeRangesBar);