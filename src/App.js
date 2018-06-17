import React, { Component } from 'react';
import {Grid, Row, Col, Collapse, Form, FormGroup, ControlLabel, FormControl, DropdownButton, MenuItem} from 'react-bootstrap';
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
			</Col
			<Col sm={10} id="main">
				<ReapingScreen availableTribute={this.state.tribute}/>
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

class ReapingScreen extends Component{
	constructor(props){
		super(props);
		this.state = {
			tribsPerDist: 0,
			distCount: 0,
			curTributes: []
		}
		this.updateState = this.updateState.bind(this);
	}
	componentDidMount(){
		console.log("Initial number of tributes: " + this.state.curTributes.length);
		this.setState({"tribsPerDist": 2, "distCount": 12});
		var newArr = this.state.curTributes.slice();
		for (var i = 0; i < 24; i++){
			newArr.push(i);
		}
		this.setState({"curTributes": newArr});
	}
	updateState(e){
		var newVal = e.target.value, st = this.state;
		var old = st.curTributes.slice(), newCount = 0;
		switch(e.target.id){
			case "tributesPerDistrict":
				this.setState({"tribsPerDist": newVal});
				newCount = newVal * st.distCount;					
				break;
			case "numDistricts":
				this.setState({"distCount": newVal});
				newCount = newVal * st.tribsPerDist;
				break;
			default:
				console.log("case not covered");
		}
		if (st.curTributes.length > newCount){
			var extras = st.curTributes.length - newCount;
			for (var i = 0; i < extras; i++){
				old.pop();
			}
			console.log(extras + " elements to be removed");
		}
		else{
			var missing = newCount - st.curTributes.length;
			for (i = 0; i < missing; i++){
				old.push("");
			}
			console.log(missing + " elements to be added");
		}
		this.setState({"curTributes": [...old]});
	}
	componentDidUpdate(){
		console.log("Current amount of tributes: " + this.state.curTributes.length);
		console.log("Available tributes: " + this.props.availableTribute.length);
	}
	render(){
		var tableContents = [], st = this.state;
		for (var i = 0; i < st.distCount; i++){
			var rowContents = [];
			for (var j = 0; j < st.tribsPerDist; j++){
				var cellNo = j * st.distCount + i;
				rowContents.push(<td key = {cellNo}><TributeInput id = {cellNo} name={""} tribList={this.props.availableTribute}/></td>)
			}
			tableContents.push(<tr key = {i}>{rowContents}</tr>);
		}
		return(
		<div>
			<Form horizontal>
				<FormGroup controlId="tributesPerDistrict">
					<Col componentClass ={ControlLabel} sm={4} xs={3}>
						Number of tributes per district:
					</Col>
					<Col>
						<FormControl className = "numUpDown" componentClass="input" type="number" bsSize="sm"
						min={2} max={8} value = {st.tribsPerDist} onChange = {this.updateState} />
					</Col>
				</FormGroup>
				<FormGroup controlId="numDistricts">
					<Col componentClass={ControlLabel} sm={4} xs={3}>
						Number of districts:
					</Col>
					<Col>
						<FormControl className = "numUpDown" componentClass="input" type="number" bsSize="sm"
						min={11} max={14} value = {st.distCount} onChange = {this.updateState} />
					</Col>
				</FormGroup>
			</Form>
			<table>
				<tbody>{tableContents}</tbody>
			</table>
		</div>);
	}
}

class TributeInput extends Component{
	constructor(props){
		super(props);
		this.onSelect = this.onSelect.bind(this);
	}
	onSelect(x){
		console.log("option " + x + " picked in selector " + this.props.id)
		if(x===2){console.log(this.props.tribList[Math.floor(Math.random() * this.props.tribList.length)].fullname)}
	}

	render(){
		var id = this.props.id;
		return(<DropdownButton bsStyle="primary" title={(this.props.name===""?"Empty slot":this.props.name)} id = {"selectTrib" + id}>
				<MenuItem eventKey={0} onSelect={this.onSelect}>Add new tribute</MenuItem>
				<MenuItem eventKey={1} onSelect={this.onSelect}>Select existing tribute</MenuItem>
				<MenuItem eventKey={2} onSelect={this.onSelect}>Pick a random tribute</MenuItem>
		</DropdownButton>);
	}
}

export default App;