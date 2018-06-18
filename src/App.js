import React, { Component } from 'react';
import {Grid, Row, Col, Collapse, Form, FormGroup, ControlLabel, FormControl,
		DropdownButton, MenuItem, Modal, InputGroup, Button, ButtonGroup} from 'react-bootstrap';
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
		activePane: "main",
		
		advancedMode: false
	}
	this.updateMenu = this.updateMenu.bind(this);
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
						"", "Foxface", "Jason", "", "", "", "", "", "", "", "", "",
						"Thresh", "Rue", "Peeta Mellark", "Katniss Everdeen"];
			for (i = 0; i < 24; i++){
				trib.push(new Player(i, "", "", i % 2 === 0 ? "M" : "F", "T" + i + ".png", "BW"));
				trib[i].fullname = TributeName[i] === "" ? ("District " + ((i - i % 2) / 2 + 1) +
									" " + (i % 2 === 0 ? "M" : "Fem") + "ale") : TributeName[i];
				var fullname = trib[i].fullname;
				trib[i].nickname = i > 21 ? fullname.substr(0, fullname.indexOf(" ")) : fullname;
			}
			this.setState({"tribute": [...trib]});
			console.log(trib);
			console.log("Default tributes loaded");
		}
		
		if(localStorage.getItem("HGEvent") != null){
			console.log("Event database detected");
			var evt = JSON.parse(localStorage.HGEvent);
			for (i = 0; i < evt.length; i++){
				evt[i] = Object.assign(new ArenaEvent(), evt[i])
			}
			this.setState({"arenaEvent": [...evt]});
			console.log("Event database loaded");
		}
		else{
			this.setState({"arenaEvent": [...DefaultEvent]});
			console.log("Default events loaded");
		}
		
		if(localStorage.getItem("HGSpecEvent") != null){
			console.log("Arena event database detected");
			var specEvt = JSON.parse(localStorage.HGSpecEvent);
			for (i = 0; i < specEvt.length; i++){
				specEvt[i] = Object.assign(new SpecialArenaEvent(), specEvt[i])
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
		var st = this.state
		if(localStorage.getItem("HGTribute") !== JSON.stringify(st.tribute)){
			localStorage.setItem("HGTribute", JSON.stringify(st.tribute));
			console.log("Tribute database updated");
		}
		if(localStorage.getItem("HGEvent") !== JSON.stringify(st.arenaEvent)){
			localStorage.setItem("HGEvent", JSON.stringify(st.arenaEvent));
			console.log("Event database updated");
		}		
		if(localStorage.getItem("HGSpecEvent") !== JSON.stringify(st.specialArenaEvent)){
			localStorage.setItem("HGSpecEvent", JSON.stringify(st.specialArenaEvent));
			console.log("Arena event database updated");
		}		
	}
	updateMenu(e){
		this.setState({activePane: e.target.id});
	}
	
	render() {
		var st = this.state, menuItem = ["main", "tribDb", "eventList", "settings"],
			optText = ["Simulate", "Tribute Database", "Event List", "Settings"], options = [];
		
		for (var i = 0; i < 4; i++){
			options.push(<li key = {i} id = {menuItem[i]} onClick = {this.updateMenu}
				className = {st.activePane === menuItem[i] ? "active" : null}>{optText[i]}</li>)
		}
		
		return (
		<Grid>
			<Row>
				<Col sm = {2} className = "nav-side-menu">
					<div className = "brand">Hunger Games Simulator</div>
					<i className = "fa fa-bars fa-2x toggle-btn" onClick = {() => this.setState({showMenu: !st.showMenu})}>Menu</i>
					<div className = "menu-list">
						<Collapse in = {st.showMenu}>
							<ul className = "menu-content">{options}</ul>
						</Collapse>
					</div>
				</Col>
				<Col sm = {10} id = "display">
					{st.activePane === "main" && <ReapingScreen availableTribute = {st.tribute}/>}
					{st.activePane === "eventList" && <EventDBScreen arenaEvent = {st.arenaEvent} specialArenaEvent = {st.specialArenaEvent} />}
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
			curTributes: [],
			
			recentPick: -1,
			
			showTributeInput: false,
			showTributePicker: false
		}
		this.updateState = this.updateState.bind(this);
		this.showTributeInput = this.showTributeInput.bind(this);
		this.hideTributeInput = this.hideTributeInput.bind(this);
		this.showTributePicker = this.showTributePicker.bind(this);
		this.hideTributePicker = this.hideTributePicker.bind(this);
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
		if (e.target.id === "tributesPerDistrict"){
			this.setState({"tribsPerDist": newVal});
			newCount = newVal * st.distCount;					
		}
		else{
			this.setState({"distCount": newVal});
			newCount = newVal * st.tribsPerDist;
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
	showTributeInput(){
		this.setState({showTributeInput: true});
	}
	hideTributeInput(){
		this.setState({showTributeInput: false});
	}
	
	showTributePicker(){
		this.setState({showTributePicker: true});
	}
	hideTributePicker(){
		this.setState({showTributePicker: false});
	}
	
	render(){
		var tableContents = [], st = this.state, pr = this.props;
		for (var i = 0; i < st.distCount; i++){
			var rowContents = [];
			for (var j = 0; j < st.tribsPerDist; j++){
				var cellNo = j * st.distCount + i;
				rowContents.push(<td key = {cellNo}>
				<TributeInput id = {cellNo} name = {""} tribList = {pr.availableTribute}
					showTributeInput = {this.showTributeInput} showTributePicker = {this.showTributePicker}/>
				</td>) //name in tributeinput must correspond to default or previous roster
			}
			tableContents.push(<tr key = {i}>{rowContents}</tr>);
		}
		return(
		<div>
			<Form horizontal>
				<FormGroup controlId = "tributesPerDistrict">
					<Col componentClass = {ControlLabel} sm = {4} xs = {3}>
						Number of tributes per district:
					</Col>
					<Col>
						<FormControl className = "numUpDown" type = "number" bsSize = "sm"
						min = {2} max = {8} value = {st.tribsPerDist} onChange = {this.updateState} />
					</Col>
				</FormGroup>
				<FormGroup controlId = "numDistricts">
					<Col componentClass = {ControlLabel} sm = {4} xs = {3}>
						Number of districts:
					</Col>
					<Col>
						<FormControl className = "numUpDown" type = "number" bsSize = "sm"
						min = {11} max= {14} value = {st.distCount} onChange = {this.updateState} />
					</Col>
				</FormGroup>
			</Form>
			<table>
				<tbody>{tableContents}</tbody>
			</table>
			<NewTributeInput show = {st.showTributeInput} hide = {this.hideTributeInput} tribList = {pr.availableTribute}/>
			<TributePicker show = {st.showTributePicker} hide = {this.hideTributePicker} tribList = {pr.availableTribute}/>
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
		switch(x){
			case 2:
				console.log(this.props.tribList[Math.floor(Math.random() * this.props.tribList.length)].fullname);
				break;
			default:
				console.log("option disabled");
		}
	}

	render(){
		var pr = this.props;
		return(<DropdownButton bsStyle = "primary" title = {(pr.name === "" ? "Empty slot" : pr.name)} id = {"selectTrib" + pr.id}>
				<MenuItem eventKey = {0} onClick = {pr.showTributeInput} onSelect = {this.onSelect}>Add new tribute</MenuItem>
				<MenuItem eventKey = {1} onClick = {pr.showTributePicker} onSelect = {this.onSelect}>Select existing tribute</MenuItem>
				<MenuItem eventKey = {2} onSelect = {this.onSelect}>Pick a random tribute</MenuItem>
		</DropdownButton>);
	}
}

class NewTributeInput extends Component{
	constructor(props){
		super(props);
		this.checkInput = this.checkInput.bind(this);
		this.state={
			tribName: "",
			tribNick: "",
			tribGender: "",
			tribDeathPicType: "BW",
			tribPicUrl: "",
			tribDeathPicUrl: "",
			generatedDeathPic: ""
		}
		this.updateTribName = this.updateTribName.bind(this);
		this.setDefaultNick = this.setDefaultNick.bind(this);
		this.updateTribNick = this.updateTribNick.bind(this);
		this.updateGender = this.updateGender.bind(this);
		this.updateDeathPicType = this.updateDeathPicType.bind(this);
		this.updatePicUrl = this.updatePicUrl.bind(this);
		this.updateDeathPicUrl = this.updateDeathPicUrl.bind(this);
		
		this.resetInput = this.resetInput.bind(this);
	}
	
	updateTribName(e){
		this.setState({tribName: e.target.value});
	}
	
	setDefaultNick(e){
		if(this.state.tribNick === ""){
			this.setState({tribNick: e.target.value});
		}
	}
	
	updateTribNick(e){
		this.setState({tribNick: e.target.value});
	}
	
	updateGender(e){
		this.setState({tribGender: e.target.value});
	}
	
	updateDeathPicType(e){
		this.setState({tribDeathPicType: e.target.value});
		if(e.target.value !== "Custom"){
			this.setState({generatedDeathPic: this.state.tribPicUrl})
		}
	}
	
	updatePicUrl(e){
		this.setState({tribPicUrl: e.target.value});
	}
	
	updateDeathPicUrl(e){
		this.setState({tribDeathPicUrl: e.target.value});
	}
	
	checkInput(e){
		var st = this.state, pr = this.props, validURL = new RegExp("/^http(s)?:[//].+[.](jpg|jpeg|gif|bmp|png)$/i");
		if(st.tribName === "" || st.tribNick === "" || st.tribPicUrl === ""){
			console.log("Cannot leave tribname, tribnick, or tribpic blank");
		}
		else{
			var foundMatch = false;
			for (var i = 0; i < pr.tribList.length; i++){
				if(st.tribName === pr.tribList[i].fullname){
					foundMatch = true;
					break;
				}
			}
			if(foundMatch){
				console.log("Duplicate spotted");
			}
			else if(st.gender === ""){
				console.log("No gender selected");
			}
			else if(!validURL.test(st.tribPicUrl) || (st.tribDeathPicType==="Custom" && !validURL.test(st.tribDeathPicUrl))){
				console.log("Invalid image url");
			}
			else{
				console.log("Input validated");
				//Save input
				pr.hide();
			}
		}
	}
	resetInput(){
		this.setState({tribName: "",
			tribNick: "",
			tribGender: "",
			tribDeathPicType: "BW",
			tribPicUrl: "",
			tribDeathPicUrl: ""});
	}
	render(){
		var st = this.state, pr = this.props;
		return(
		<Modal backdrop = "static" show = {pr.show} onHide = {pr.hide} onExited = {this.resetInput}>
			<Modal.Header closeButton>
				<Modal.Title>Add new tribute</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col sm = {8}>
						<Form>
							<FormGroup controlId = "newTribName">
								<InputGroup>
									<InputGroup.Addon>Name</InputGroup.Addon>
									<FormControl type = "text" value = {st.tribName} onChange = {this.updateTribName} onBlur = {this.setDefaultNick}/>
								</InputGroup>
							</FormGroup>
							<FormGroup controlId = "newTribNick">
								<InputGroup>
									<InputGroup.Addon>Nickname</InputGroup.Addon>
									<FormControl type = "text" value = {st.tribNick} onChange = {this.updateTribNick}/>
								</InputGroup>
							</FormGroup>
							<FormGroup controlId = "newTribGender">
								<InputGroup>
									<InputGroup.Addon>Gender</InputGroup.Addon>
									<FormControl componentClass = "select" value = {st.tribGender} onChange = {this.updateGender}>
										<option disabled hidden></option>
										<option value = "M">Male</option>
										<option value = "F">Female</option>
										<option value = "N">Neuter</option>
										<option value = "I">Indeterminate</option>
									</FormControl>
								</InputGroup>
							</FormGroup>
							<FormGroup controlId = "newTribDeathPicType">
								<InputGroup>
									<InputGroup.Addon>Death Pic</InputGroup.Addon>
									<FormControl componentClass = "select" value = {st.tribDeathPicType} onChange = {this.updateDeathPicType}>
										<option value = "BW">Grayscale</option>
										<option value = "N">Normal</option>
										<option value = "X">Cross mark</option>
										<option value = "Custom">Custom</option>
									</FormControl>
								</InputGroup>
							</FormGroup>
						</Form>
					</Col>
					<Col sm = {4}>
						<div className = "imgInputHolder">
							<img alt = "Tribute pic" src = "default.png" height = {100} width = {100}/>
							<div className = "middle">
								<FormControl type = "text" id = "newTribPicUrl" bsSize = "sm" placeholder = "Enter image URL here"
									value = {st.tribPicUrl} onChange = {this.updatePicUrl}/>
							</div>
						</div>
						<br/><br/>
						<div className = "imgInputHolder">
							<img alt="Death pic" src = {st.generatedDeathPic} height = {100} width = {100}/>
							<div className = "middle">
							{st.tribDeathPicType === "Custom" && <FormControl type = "text" id = "newTribDeathPicUrl" bsSize = "sm"
							placeholder = "Enter image URL here" value = {st.tribDeathPicUrl} onChange = {this.updateDeathPicUrl}/>}
							</div>
						</div>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle = "default" onClick = {this.checkInput}>Submit</Button>
				<Button bsStyle = "danger" onClick = {pr.hide}>Cancel</Button>
			</Modal.Footer>
		</Modal>
		);
	}
}

class TributePicker extends Component{
	constructor(props){
		super(props);
		this.state = {
			currentList: [],
			displayedList: [],
			searchTerm: ""
		}
		this.updateOptionFilter = this.updateOptionFilter.bind(this);
		this.sortByName = this.sortByName.bind(this);
		this.sortById = this.sortById.bind(this);
		this.showSortedSearch = this.showSortedSearch.bind(this);
	}
	
	componentWillReceiveProps(){
		var pr = this.props, options = [];
		for (var i = 0; i < pr.tribList.length; i++){
			options.push({id: pr.tribList[i].id, fullname: pr.tribList[i].fullname});
		}
		this.setState({currentList: [...options], displayedList: [...options]});
	}
	
	updateOptionFilter(e){
		var newList = [], st = this.state;
		for (var i = 0; i < st.currentList.length; i++){
			if(st.currentList[i].fullname.toLowerCase().indexOf(e.target.value.toLowerCase())>-1){
				newList.push({id: st.currentList[i].id, fullname: st.currentList[i].fullname})
			};
		}
		this.setState({searchTerm: e.target.value, displayedList: [...newList]});
	}
	
	sortByName(){
		var switched = true, b = [...this.state.currentList];
		while (switched){
			switched = false;
			for (var i = 0; i < (b.length - 1); i++){
				if(b[i].fullname.toLowerCase() > b[i + 1].fullname.toLowerCase()){
					[b[i], b[i + 1]] = [b[i + 1], b[i]];
					switched = true;
					break;
				}
			}
		}
		this.showSortedSearch(b);
	}
	
	sortById(){
		var switched = true, b = [...this.state.currentList];
		while (switched){
			switched = false;
			for (var i = 0; i < (b.length - 1); i++){
				if(b[i].id > b[i + 1].id){
					[b[i], b[i + 1]] = [b[i + 1], b[i]];
					switched = true;
					break;
				}
			}
		}
		this.showSortedSearch(b);
	}
	
	showSortedSearch(source){
		var newList = [];
		for (var i = 0; i < source.length; i++){
			if(source[i].fullname.toLowerCase().indexOf(this.state.searchTerm.toLowerCase())>-1){
				newList.push({id: source[i].id, fullname: source[i].fullname})
			};
		}
		this.setState({displayedList: [...newList], currentList: [...source]});
	}

	render(){
		var pr = this.props, st = this.state, options = [];
		for (var i = 0; i < st.displayedList.length; i++){
			options.push(<option key = {i} value = {st.displayedList[i].id} > {st.displayedList[i].fullname}</option>)
		}

		return(
		<Modal backdrop = "static" show = {pr.show} onHide = {pr.hide}>
			<Modal.Header closeButton>
				<Modal.Title>Select from existing tributes</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col sm = {4}>
						<FormControl type = "text" placeholder = "Search by name" value = {st.searchTerm} onChange = {this.updateOptionFilter}/>
						<FormControl componentClass = "select" size = {8}>
							{options}
						</FormControl>
						<Button onClick = {this.sortByName}>Sort by name</Button>
						<Button onClick = {this.sortById}>Sort by ID</Button>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle = "default">Submit</Button>
				<Button bsStyle = "danger" onClick = {pr.hide}>Cancel</Button>
			</Modal.Footer>
		</Modal>)
	}
}

class EventDBScreen extends Component{
	constructor(props){
		super(props)
		this.state = {
			selectedEvent: new ArenaEvent("", 0, 0, []),
			selectedEventIndex: -1,
			eventSearchTerm: ""
		}
		this.getSelectedEvent = this.getSelectedEvent.bind(this);
		this.updateEventFilter = this.updateEventFilter.bind(this);
	}
	
	getSelectedEvent(e){
		this.setState({selectedEvent: this.props.arenaEvent[e.target.value],
						selectedEventIndex: e.target.value});
	}
	
	updateEventFilter(e){
		this.setState({eventSearchTerm: e.target.value});
		if (this.state.selectedEvent.eventText.toLowerCase().indexOf(e.target.value) === -1){
			this.setState({selectedEventIndex: -1});
		}
	}
	
	render(){
		var eventList = [], arenaEventList = [], pr = this.props, st = this.state;
		for (var i = 0; i < pr.arenaEvent.length; i++){
			if(pr.arenaEvent[i].eventText.toLowerCase().indexOf(st.eventSearchTerm) > -1){
				eventList.push(<option key = {i} value = {i}>{pr.arenaEvent[i].eventText}</option>);
			}
		}
		for (i = 0; i < pr.specialArenaEvent.length; i++){
			arenaEventList.push(<option key = {i}>{pr.specialArenaEvent[i].leadText}</option>);
		}
		
		if (st.selectedEventIndex > -1){
			var scope = [];
			if (st.selectedEvent.isBloodbathEvent()) scope.push("Bloodbath");
			if (st.selectedEvent.isDayEvent()) scope.push("Day");
			if (st.selectedEvent.isNightEvent()) scope.push("Night");
			if (st.selectedEvent.isFeastEvent()) scope.push("Feast");
			var scopeList = scope[0];
			if (scope.length > 1){
				for (i = 1; i < scope.length; i++){
					scopeList += ", " + scope[i]
				}
			}
			
			var killers = [], victims = [], killerList = "", killedList = "";
			if (st.selectedEvent.deaths() > 0){
				for (i = 0; i < st.selectedEvent.playerCount; i++){
					if (st.selectedEvent.p[i].isKiller) killers.push(i);
					if (st.selectedEvent.p[i].deathType > 0) victims.push(i);
				}
				for (i = 0; i < killers.length; i++){
					killerList += (i > 0 ? ", " : "") + "Player" + (killers[i] + 1);
				}
				for (i = 0; i < victims.length; i++){
					killedList += (i > 0 ? ", " : "") + "Player" + (victims[i] + 1);
				}
			}
			
			var eventDesc = (<div>
			{st.selectedEvent.eventText}<br/>
			Event scope: {scopeList}<br/>
			Killer: {killers.length > 0 ? killerList : "None"}<br/>
			Killed: {victims.length > 0 ? killedList : "None"}
			</div>)
		}
		
		return (<div>
			<Row>
				<Col sm={10}>
					<FormControl type = "text" placeholder = "Search event" value = {st.eventSearchTerm} onChange = {this.updateEventFilter}/>
					<select size={10} value = {st.selectedEventIndex} onChange = {this.getSelectedEvent}>{eventList}</select>
					<br/>
					{st.selectedEventIndex === -1 ? "Click on an event in the list to see its description" : eventDesc}
				</Col>
				<Col sm={2}>
					<ButtonGroup vertical bsSize="sm">
						<Button>Add new event</Button>
						<Button>Edit event</Button>
						<Button>Delete event</Button>
						<Button>Restore defaults</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<Row>
				<Col sm={10}><select size = {5}>{arenaEventList}</select></Col>
				<Col sm={2}>
					<ButtonGroup vertical bsSize="sm">
						<Button>Add new arena event</Button>
						<Button>Edit arena event</Button>
						<Button>Delete arena event</Button>
						<Button>Restore defaults</Button>
					</ButtonGroup>
				</Col>
			</Row>
		</div>);
	}
}

export default App;