import React, { Component } from "react";
import "./styles.scss";

import CustomScrollbar from "./CustomScrollbar";
import Content from "./Content";

class App extends Component {
  constructor() {
    super();

    this.state = {
      menuHeight: 0
    };
    this.heightUpdated = this.heightUpdated.bind(this);
  }

  heightUpdated(height) {
    this.setState({ menuHeight: height });
  }

  render() {
    return (
      <div className="app">
        <div className="row no-gutters">
          {/* sidebar */}
          <section className="sidebar">
            <div className="sidebar-top"></div>
            <div className="menu-wrapper">
              <div className="menu-container">
                <CustomScrollbar contentHeight={this.state.menuHeight}>
                  <Content menuUpdate={this.heightUpdated} />
                </CustomScrollbar>
              </div>
            </div>
          </section>
          {/* main section */}
          <section className="main-wrapper">
            <header>
              <h2 className="text-center">Custom Scroll Bar</h2>
            </header>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
