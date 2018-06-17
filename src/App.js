import React, { Component } from 'react';
import {Grid, Row, Col, Collapse} from 'react-bootstrap';

class App extends Component{
   constructor(props, context) {
    super(props, context);
	this.state ={
		"showMenu": false,
		"advancedMode": false,
		"activePane": "main"
	}
  }

  render() {
    return (<Grid>
	<Row>
	<Col sm={2} className="nav-side-menu">
    <div className="brand">Hunger Games Simulator</div>
    <i className="fa fa-bars fa-2x toggle-btn" onClick={() => this.setState({ showMenu: !this.state.showMenu })}>Menu</i>
    <div className="menu-list">
	<Collapse in={this.state.showMenu}>
        <ul id="menu-content" className="menu-content">
			<li className="active">
                Simulate
            </li>
            <li>
                Tribute Database
            </li>
			<li>
                Event List
            </li>
			<li>
                Settings
            </li>
        </ul>
		</Collapse>
    </div>
</Col></Row></Grid>);
  }
}

export default App;