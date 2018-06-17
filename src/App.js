import React, { Component } from 'react';
import {Grid, Row, Col, Collapse} from 'react-bootstrap';
import ArenaEvent, {DefaultEvent} from './defaultEvent';
import SpecialArenaEvent, {DefaultSpecialEvent} from './defaultSpecialEvent';

class App extends Component{
   constructor(props, context) {
    super(props, context);
	this.state ={
		arenaEvent: [],
		specialArenaEvent: [],
		tribute: [],
		showMenu: false,
		advancedMode: false,
		activePane: "main"
	}
  }
	componentDidMount(){
		if(localStorage.getItem("HGTribute")!=null){
			var trib = [];
			console.log("Tribute database detected");
			trib = JSON.parse(localStorage.HGTribute);
			for (var i = 0; i < trib.length; i++){
				trib[i] = Object.assign(new Player(), trib[i]);
			}
			this.setState({"tribute": [...trib]});
			console.log("Tribute database loaded");
		}
		else{
			console.log("No tribute database detected");
			trib = [];			
			var TributeName = ["Marvel", "Glimmer", "Cato", "Clove", "", "", "", "",
						"", "Foxface", "Jason", "", "", "", "", "",
						"", "", "", "", "Thresh", "Rue", "Peeta Mellark", "Katniss Everdeen"];
			for ( i = 0; i < 24; i++){
				trib.push(new Player(i, "", "", i%2===0 ? "M" : "F", "T"+i+".png", "BW"));
				trib[i].fullname = TributeName[i] === "" ? ("District " + ((i-i%2)/2+1) + " " + (i%2===0 ? "M" : "Fem") + "ale") : TributeName[i];
				var fullname = trib[i].fullname;
				trib[i].nickname = i > 21 ? fullname.substr(0, fullname.indexOf(" ")) : fullname;
			}
			this.setState({"tribute": [...trib]});
			console.log(trib);
			console.log("Default tributes loaded");
		}
		
		if(localStorage.getItem("HGEvent")!=null){
			console.log("Event database detected");
			var evt=JSON.parse(localStorage.HGEvent);
			for (i=0; i<evt.length; i++){
				evt[i]=Object.assign(new ArenaEvent(), evt[i])
			}
			this.setState({"arenaEvent": [...evt]});
			console.log("Event database loaded");
		}
		else{
			this.setState({"arenaEvent": [...DefaultEvent]});
			console.log("Default events loaded");
		}
		
		if(localStorage.getItem("HGSpecEvent")!=null){
			console.log("Arena event database detected");
			var specEvt=JSON.parse(localStorage.HGSpecEvent);
			for (i=0; i<specEvt.length; i++){
				specEvt[i]=Object.assign(new SpecialArenaEvent(), specEvt[i])
			}
			this.setState({"specialArenaEvent": [...specEvt]});
			console.log("Arena event database loaded");
		}
		else{
			this.setState({"specialArenaEvent": [...DefaultSpecialEvent]});
			console.log("Default arena events loaded");			
		}
	}
	
	componentDidUpdate(){

		if(localStorage.getItem("HGTribute")!==JSON.stringify(this.state.tribute)){
			localStorage.setItem("HGTribute", JSON.stringify(this.state.tribute));
			console.log("Tribute database updated");
		}

		if(localStorage.getItem("HGEvent")!==JSON.stringify(this.state.arenaEvent)){
			localStorage.setItem("HGEvent", JSON.stringify(this.state.arenaEvent));
			console.log("Event database updated");
		}		

		if(localStorage.getItem("HGSpecEvent")!==JSON.stringify(this.state.specialArenaEvent)){
			localStorage.setItem("HGSpecEvent", JSON.stringify(this.state.specialArenaEvent));
			console.log("Arena event database updated");
		}		
	}
  render() {
    return (
	<Grid>
		<Row>
			<Col sm={2} className="nav-side-menu">
				<div className="brand">Hunger Games Simulator</div>
				<i className="fa fa-bars fa-2x toggle-btn" onClick={() => this.setState({ showMenu: !this.state.showMenu })}>Menu</i>
				<div className="menu-list">
					<Collapse in={this.state.showMenu}>
						<ul className="menu-content">
							<li className="active">Simulate</li>
							<li>Tribute Database</li>
							<li>Event List</li>
							<li>Settings</li>
						</ul>
					</Collapse>
				</div>
			</Col>
		</Row>
	</Grid>);
  }
}

function Player(id, fullname, nickname, gender, imageUrl, deathImage){
	this.id = id;
	this.fullname = fullname;
	this.nickname = nickname;
	this.gender = gender;
	this.imageUrl = imageUrl;
	this.deathImage = deathImage;
	this.wins = 0;
	this.soloKills = 0;
	this.sharedKills = 0;
	this.kills = function(){return this.soloKills + this.sharedKills;};
	this.combatDeaths = 0;
	this.suicides = 0;
	this.otherDeaths = 0;
	this.deaths = function(){return this.combatDeaths + this.suicides + this.otherDeaths;}
}

export default App;