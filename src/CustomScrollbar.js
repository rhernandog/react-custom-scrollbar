import React, { Component } from "react";
import PropTypes from "prop-types";
import { TweenLite } from "gsap";

class CustomScrollbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: false,
      scrollWrapperHeight: 0,
      scrollBarHeight: 0,
      maxScroll: 0
    };

    this.updateScrollHeight = this.updateScrollHeight.bind(this);
    this.scrollEventHandler = this.scrollEventHandler.bind(this);

    this.scrollWrapper = null;
    this.customScrollHandler = null;
  }

  componentDidMount() {
    if (navigator.userAgent.match(/(android)|(kindle)|(Silk)|(ipad)|(iphone)|(mobile)/gi) !== null) {
      console.log("device!!!");
      this.setState({ isMobile: true });
    }
    this.setState({
      scrollWrapperHeight: this.scrollWrapper.clientHeight
    });
  }

  componentDidUpdate(preProps) {
    if (preProps.contentHeight !== this.props.contentHeight) {
      this.updateScrollHeight();
    }
  }

  // Check if the height of the content is bigger than the
  // height of the scroll wrapper
  updateScrollHeight() {
    const { contentHeight } = this.props;
    const { scrollWrapperHeight } = this.state;
    const heightDelta = scrollWrapperHeight - contentHeight;
    // prettier-ignore
    const scrollBarHeight = heightDelta < 0 ?
      Math.round(Math.pow(scrollWrapperHeight, 2) / contentHeight)
      : 0;
    // If the content is bigger than the wrapper set the height of the
    // scroll bar, if is less than the wrapper the scrollbar height is 0
    this.setState({
      scrollBarHeight,
      maxScroll: contentHeight - scrollWrapperHeight
    });
  }

  scrollEventHandler(e) {
    const { maxScroll, scrollBarHeight, scrollWrapperHeight } = this.state;

    TweenLite.to(this.customScrollHandler, 0.1, {
      y: (scrollWrapperHeight - scrollBarHeight) * (e.target.scrollTop / maxScroll)
    });
  }

  render() {
    return (
      // prettier-ignore
      <div
        className={`scroll-wrapper${this.state.isMobile ? " mobile" : ""}`}
        ref={e => (this.scrollWrapper = e)}
      >
        <div className="scroll-outer-container">
          {/* prettier-ignore */}
          <div
            className="scroll-inner-container"
            onScroll={this.scrollEventHandler}
          >
            <div className="scroll-content">{this.props.children}</div>
          </div>
          <div className="scrollbar-container">
            <div
              className="custom-scrollbar"
              id="customScrollBar"
              style={{
                height: this.state.scrollBarHeight
              }}
              ref={e => (this.customScrollHandler = e)}
            />
          </div>
        </div>
      </div>
    );
  }
}

CustomScrollbar.propTypes = {
  contentHeight: PropTypes.number
};

CustomScrollbar.defaultProps = {
  contentHeight: 0
};

export default CustomScrollbar;
