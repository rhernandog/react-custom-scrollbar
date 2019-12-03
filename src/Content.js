import React, { Component } from "react";
import elements from "./elements";

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeElement: null
    };

    this.menuElements = {};

    this.setActiveElement = this.setActiveElement.bind(this);
  }

  componentDidMount() {
    this.props.menuUpdate(this.ulElement.clientHeight);
  }

  setActiveElement(e) {
    const targetId = e.target.getAttribute("data-target");
    if (!targetId) return;

    this.menuElements[targetId].classList.toggle("active");

    this.props.menuUpdate(this.ulElement.clientHeight);
  }

  render() {
    return (
      <div className="content-container">
        <div className="content">
          <ul className="list-group" ref={e => (this.ulElement = e)}>
            {elements.map(e => (
              <button
                className="list-group-item list-group-item-action"
                key={e.id}
                data-target={e.id}
                onClick={this.setActiveElement}
                ref={el => {
                  this.menuElements[e.id] = el;
                }}
              >
                {e.title}
                <div className="bg-info text-white item-content">
                  <div className="text">{e.content}</div>
                </div>
              </button>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Content;
