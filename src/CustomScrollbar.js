import React, { Component } from "react";
import PropTypes from "prop-types";
import { TweenLite } from "gsap";
import { Draggable } from "gsap/Draggable";

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
    this.setDraggableBounds = this.setDraggableBounds.bind(this);

    this.scrollWrapper = null;
    this.customScrollHandler = null;
    this.scrollInnerContainer = null;
    // GSAP draggable instance
    this.scrollHandlerDraggable = null;
    this.draggableBounds = {
      minY: 0,
      maxY: 0
    };
  }

  componentDidMount() {
    if (navigator.userAgent.match(/(android)|(kindle)|(Silk)|(ipad)|(iphone)|(mobile)/gi) !== null) {
      this.setState({ isMobile: true });
    }
    this.setState({
      scrollWrapperHeight: this.scrollWrapper.clientHeight
    });
    const { scrollInnerContainer, scrollEventHandler } = this;
    scrollInnerContainer.addEventListener("scroll", scrollEventHandler);
    this.scrollHandlerDraggable = Draggable.create(this.customScrollHandler, {
      type: "y",
      bounds: this.draggableBounds,
      cursor: "default",
      onDrag: () => {
        const { scrollWrapperHeight, scrollBarHeight, maxScroll } = this.state;
        // prettier-ignore
        scrollInnerContainer.scrollTop =
          this.scrollHandlerDraggable[0].y / 
          (scrollWrapperHeight - scrollBarHeight) * maxScroll
      },
      onDragStart: () => scrollInnerContainer.removeEventListener("scroll", scrollEventHandler),
      onDragEnd: () => scrollInnerContainer.addEventListener("scroll", scrollEventHandler)
    });
  }

  componentWillUnmount() {
    this.scrollInnerContainer.removeEventListener("scroll", this.scrollEventHandler);
    this.scrollHandlerDraggable[0].kill();
  }

  componentDidUpdate(preProps, preState) {
    if (preProps.contentHeight !== this.props.contentHeight) {
      this.updateScrollHeight();
    }
    if (preState.scrollBarHeight !== this.state.scrollBarHeight) {
      this.setDraggableBounds();
    }
  }

  setDraggableBounds() {
    const { scrollWrapperHeight, scrollBarHeight } = this.state;
    this.draggableBounds.maxY = scrollWrapperHeight - scrollBarHeight;
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
    const maxScroll = contentHeight - scrollWrapperHeight;
    // If the content is bigger than the wrapper set the height of the
    // scroll bar, if is less than the wrapper the scrollbar height is 0
    this.setState({ scrollBarHeight, maxScroll });

    TweenLite.to(this.customScrollHandler, 0.1, {
      // prettier-ignore
      y: (scrollWrapperHeight - scrollBarHeight) * 
        (this.scrollInnerContainer.scrollTop / maxScroll)
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
            ref={e => this.scrollInnerContainer = e}
          >
            <div className="scroll-content">{this.props.children}</div>
          </div>
          <div className="scrollbar-container">
            <div
              className="custom-scrollbar"
              data-testid="customScrollBar"
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
