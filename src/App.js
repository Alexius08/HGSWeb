import React, { Component } from 'react';
import {Grid, Row, Col, Collapse, Form, FormGroup, ControlLabel, FormControl,
		DropdownButton, MenuItem, Modal, InputGroup, Button, ButtonGroup, ListGroup,
		ListGroupItem, Checkbox, Tabs, Tab, Radio} from 'react-bootstrap';
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
	this.resetEvents = this.resetEvents.bind(this);
	this.resetSpecialEvents = this.resetSpecialEvents.bind(this);
  }
	componentDidMount(){
		if(localStorage.getItem("HGTribute")!=null){
			var trib = [];
			console.log("Tribute database detected");
			trib = JSON.parse(localStorage.HGTribute);
			for (var i = 0; i < trib.length; i++){
				trib[i] = Object.assign(new Player(), trib[i]);
			}
			this.setState({tribute: [...trib]});
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
			this.setState({tribute: [...trib]});
			console.log(trib);
			console.log("Default tributes loaded");
		}
		
		if(localStorage.getItem("HGEvent") != null){
			console.log("Event database detected");
			var evt = JSON.parse(localStorage.HGEvent);
			for (i = 0; i < evt.length; i++){
				evt[i] = Object.assign(new ArenaEvent(), evt[i])
			}
			this.setState({arenaEvent: [...evt]});
			console.log("Event database loaded");
		}
		else{
			this.setState({arenaEvent: [...DefaultEvent]});
			console.log("Default events loaded");
		}
		
		if(localStorage.getItem("HGSpecEvent") != null){
			console.log("Arena event database detected");
			var specEvt = JSON.parse(localStorage.HGSpecEvent);
			for (i = 0; i < specEvt.length; i++){
				specEvt[i] = Object.assign(new SpecialArenaEvent(), specEvt[i])
			}
			this.setState({specialArenaEvent: [...specEvt]});
			console.log("Arena event database loaded");
		}
		else{
			this.setState({specialArenaEvent: [...DefaultSpecialEvent]});
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
	
	resetEvents(){
		this.setState({arenaEvent: [...DefaultEvent]});
		console.log("Default events restored");
	}
	
	resetSpecialEvents(){
		this.setState({specialArenaEvent: [...DefaultSpecialEvent]});
		console.log("Default arena events restored");		
	}
	
	render() {
		var st = this.state, menuItem = ["main", "tribStats", "eventList", "settings"],
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
					{st.activePane === "main" && <ReapingScreen tribute = {st.tribute}/>}
					{st.activePane === "eventList" && <EventDBScreen arenaEvent = {st.arenaEvent} specialArenaEvent = {st.specialArenaEvent} resetEvents = {this.resetEvents} resetSpecialEvents = {this.resetSpecialEvents}/>}
					{st.activePane === "settings" && <SettingsPanel/>}
					{st.activePane === "tribStats" && <TribStats tribute = {st.tribute}/>}
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

function isValidNumInput(numInput){
	return (isFinite(numInput.value) && numInput.value % 1 === 0 && numInput.value >= numInput.min && numInput.value <= numInput.max);
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
		this.dropdownClick = this.dropdownClick.bind(this);
		this.loadSelected = this.loadSelected.bind(this);
		this.pickRandom = this.pickRandom.bind(this);
	}
	componentDidMount(){
		this.setState({tribsPerDist: 2, distCount: 12});
		var newArr = [];
		for (var i = 0; i < 24; i++){
			newArr.push(-1);
		}
		console.log(sessionStorage.length)
		if (sessionStorage.HGSRoster){
			this.setState({curTributes: JSON.parse(sessionStorage.HGSRoster)});
		}
		else{
			this.setState({curTributes: newArr});
		}
	}
	
	updateState(e){
		if (isValidNumInput(e.target)){
			var newVal = e.target.value, st = this.state;
			var old = st.curTributes.slice(), newCount = 0;
			if (e.target.id === "tributesPerDistrict"){
				if(newVal > 1 && newVal < 9){
					this.setState({tribsPerDist: newVal});
					newCount = newVal * st.distCount;
				}
			}
			else{
				if(newVal > 10 && newVal < 15){
					this.setState({distCount: newVal});
					newCount = newVal * st.tribsPerDist;
				}
			}
			
			if (st.curTributes.length > newCount){
				var extras = st.curTributes.length - newCount;
				for (var i = 0; i < extras; i++){
					old.pop();
				}
				console.log(extras + " elements to be removed");
			}
			if (st.curTributes.length < newCount){
				var missing = newCount - st.curTributes.length;
				for (i = 0; i < missing; i++){
					old.push(-1);
				}
				console.log(missing + " elements to be added");
			}
			this.setState({"curTributes": [...old]});
		}
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
	
	dropdownClick(e){
		this.setState({recentPick: parseInt(e.target.id.substr(10), 10)});
	}
	
	loadSelected(x){
		var newSelection = this.state.curTributes.slice();
		newSelection[this.state.recentPick] = parseInt(x, 10);
		this.setState({curTributes: [...newSelection]});
		sessionStorage.setItem("HGSRoster", JSON.stringify(newSelection));
	}
	
	pickRandom(){
		var st = this.state, pr = this.props, newSelection = st.curTributes.slice(), options = [];
		for (var i = 0; i < pr.tribute.length; i++){
			if (st.curTributes.indexOf(i) === -1 || st.curTributes.indexOf(i) === st.recentPick){
				options.push({id: pr.tribute[i].id, fullname: pr.tribute[i].fullname});
			}
		}
		if (options.length > 0){
			newSelection[st.recentPick] = options[Math.floor(Math.random() * options.length)].id;
			if (isNaN(newSelection[st.recentPick])) console.log("Error detected");
			this.setState({curTributes: [...newSelection]});
			sessionStorage.setItem("HGSRoster", JSON.stringify(newSelection));
		}
		else{
			console.log("No more tributes left");
		}
	}
	
	render(){
		var tableContents = [], st = this.state, pr = this.props;
		for (var i = 0; i < st.distCount; i++){
			var rowContents = [];
			for (var j = 0; j < st.tribsPerDist; j++){
				var cellNo = j * st.distCount + i;
				rowContents.push(<td key = {cellNo}>
				<DropdownButton className = "tribPicker" bsStyle = "primary" title = {(st.curTributes[cellNo] === -1 ? "Empty slot" : Object.assign({}, pr.tribute[st.curTributes[cellNo]]).fullname)}
				id = {"selectTrib" + cellNo} onClick = {this.dropdownClick}>
					<MenuItem eventKey = {0} onSelect = {this.showTributeInput}>Add new tribute</MenuItem>
					<MenuItem eventKey = {1} onSelect = {this.showTributePicker}>Select existing tribute</MenuItem>
					<MenuItem eventKey = {2} onSelect = {this.pickRandom}>Pick a random tribute</MenuItem>
				</DropdownButton>
				</td>)
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
			<NewTributeInput show = {st.showTributeInput} hide = {this.hideTributeInput} tribList = {pr.tribute} excludedTributes = {st.curTributes}
				currentSlot = {st.recentPick} loadSelected = {this.loadSelected}/>
			<TributePicker show = {st.showTributePicker} hide = {this.hideTributePicker} tribList = {pr.tribute} excludedTributes = {st.curTributes}
				currentSlot = {st.recentPick} loadSelected = {this.loadSelected}/>
		</div>);
	}
}

class NewTributeInput extends Component{
	constructor(props){
		super(props);
		this.checkInput = this.checkInput.bind(this);
		this.state = {
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
		var st = this.state, pr = this.props, validURL = new RegExp("^http(s)?:[//].+[.](jpg|jpeg|gif|bmp|png)$", "i");
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
			else if(!validURL.test(st.tribPicUrl) || (st.tribDeathPicType === "Custom" && !validURL.test(st.tribDeathPicUrl))){
				console.log("Invalid image url");
			}
			else{
				console.log("Input validated");
				var newTribute = new Player();
				newTribute.fullname = st.tribName;
				newTribute.nickname = st.tribNick;
				newTribute.gender = st.gender;
				newTribute.imageUrl = st.tribPicUrl;
				newTribute.deathImage = st.tribDeathPicType === "Custom" ? st.tribDeathPicUrl : st.tribDeathPicType;
				console.log(newTribute);
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
		var st = this.state, pr = this.props, validURL = RegExp("^http(s)?:[//].+[.](jpg|jpeg|gif|bmp|png)$", "i");
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
							<img alt = "Tribute pic" src = {validURL.test(st.tribPicUrl) ? st.tribPicUrl : "default.png"} height = {100} width = {100}/>
							<div className = "middle">
								<FormControl type = "text" id = "newTribPicUrl" bsSize = "sm" placeholder = "Enter image URL here"
									value = {st.tribPicUrl} onChange = {this.updatePicUrl}/>
							</div>
						</div>
						<br/><br/>
						<div className = "imgInputHolder">
							<img alt="Death pic" src = {st.tribDeathPicType === "Custom" ? (validURL.test(st.tribDeathPicUrl) ? st.tribDeathPicUrl : (validURL.test(st.tribPicUrl) ? st.tribPicUrl : "default.png")) :
							(validURL.test(st.tribPicUrl) ? st.tribPicUrl : "default.png")} className = {st.tribDeathPicType === "BW" ? "grayScaleDeathPic" : undefined}
							height = {100} width = {100}/>
							<div className = "middle">
							{st.tribDeathPicType === "Custom" && <FormControl type = "text" id = "newTribDeathPicUrl" bsSize = "sm"
							placeholder = "Enter image URL here" value = {st.tribDeathPicUrl} onChange = {this.updateDeathPicUrl}/>}
							</div>
							<div className = "overlay">
								{st.tribDeathPicType === "X" && <img alt = "Cross mark" src = "crossmark.png" height = {100} width = {100}/>}
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
			searchTerm: "",
			selectedTrib: -1
		}
		this.updateOptionFilter = this.updateOptionFilter.bind(this);
		this.sortByName = this.sortByName.bind(this);
		this.sortById = this.sortById.bind(this);
		this.showSortedSearch = this.showSortedSearch.bind(this);
		this.loadSelected = this.loadSelected.bind(this);
		this.setSelection = this.setSelection.bind(this);
	}
	
	componentWillReceiveProps(){
		var pr = this.props, options = [];
		for (var i = 0; i < pr.tribList.length; i++){
			if (pr.excludedTributes.indexOf(i) === -1 || pr.excludedTributes.indexOf(i) === pr.currentSlot){
				options.push({id: pr.tribList[i].id, fullname: pr.tribList[i].fullname});
			}
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

	loadSelected(){
		this.props.loadSelected(this.state.selectedTrib);
		this.props.hide();
	}
	
	setSelection(e){
		this.setState({selectedTrib: e.target.value})
	}
	
	render(){
		var pr = this.props, st = this.state, options = [];
		options.push(<option key = {-1} value = {-1} hidden disabled></option>);
		for (var i = 0; i < st.displayedList.length; i++){
			options.push(<option key = {i} value = {st.displayedList[i].id} > {st.displayedList[i].fullname}</option>)
		}

		return(
		<Modal backdrop = "static" show = {pr.show} onHide = {pr.hide} onEnter = {() => console.log(this.props.currentSlot)}>
			<Modal.Header closeButton>
				<Modal.Title>Select from existing tributes</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col sm = {4}>
						<FormControl type = "text" placeholder = "Search by name" value = {st.searchTerm} onChange = {this.updateOptionFilter}/>
						<FormControl componentClass = "select" size = {8} value = {st.selectedTrib} onChange = {this.setSelection}>
							{options}
						</FormControl>
						<Button onClick = {this.sortByName}>Sort by name</Button>
						<Button onClick = {this.sortById}>Sort by ID</Button>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle = "default" onClick = {this.loadSelected}>Submit</Button>
				<Button bsStyle = "danger" onClick = {pr.hide}>Cancel</Button>
			</Modal.Footer>
		</Modal>)
	}
}

class TribStats extends Component{
	constructor(props){
		super(props);
		this.state = {selectedTributeIndex: -1};
		this.getSelectedTribute = this.getSelectedTribute.bind(this);
	}
	
	getSelectedTribute(e){
		this.setState({selectedTributeIndex: parseInt(e.target.id.substr(4), 10)})
	}
	
	render(){
		var tribList = [], pr = this.props, st = this.state;
		for (var i = 0; i < pr.tribute.length; i++){
			tribList.push(<ListGroupItem key = {i} id = {"trib" + pr.tribute[i].id}
						active = {st.selectedTributeIndex === pr.tribute[i].id}
						onClick = {this.getSelectedTribute}>{pr.tribute[i].fullname}</ListGroupItem>);
		}
		
		return(<Row>
			<Col sm = {4}>
				<ListGroup id = "arenaEventSearchResult">{tribList}</ListGroup>
			</Col>
			<Col sm = {4}>
				<img src = {st.selectedTributeIndex > -1 ? pr.tribute[st.selectedTributeIndex].imageUrl : ""} height = {100} width = {100} alt = {st.selectedTributeIndex > -1 ? pr.tribute[st.selectedTributeIndex].fullname : ""}/>
				<table>
					<tbody>
					<tr>
						<td><b>Name</b></td>
						<td>{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].fullname}</td>
					</tr>
					<tr>
						<td><b>Wins</b></td>
						<td align="right">{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].wins}</td>
					</tr>
					<tr>
						<td><b>Kills</b></td>
						<td align="right">{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].kills()}</td>
					</tr>
					<tr>
						<td>Solo Kills</td>
						<td align="right">{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].soloKills}</td>
					</tr>
					<tr>
						<td>Shared Kills</td>
						<td align="right">{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].sharedKills}</td>
					</tr>
					<tr>
						<td><b>Deaths</b></td>
						<td align="right">{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].deaths()}</td>
					</tr>
					<tr>
						<td>Combat Deaths</td>
						<td align="right">{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].combatDeaths}</td>
					</tr>
					<tr>
						<td>Suicides</td>
						<td align="right">{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].suicides}</td>
					</tr>
					<tr>
						<td>Other Deaths</td>
						<td align="right">{st.selectedTributeIndex > -1 && pr.tribute[st.selectedTributeIndex].otherDeaths}</td>
					</tr>
					</tbody>
				</table>
			</Col>
			<Col sm = {4}></Col>
		</Row>)
	}
}

class EventDBScreen extends Component{
	constructor(props){
		super(props)
		this.state = {
			selectedEvent: new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 0}]),
			selectedEventIndex: -1,
			eventSearchTerm: "",
			
			selectedArenaEventIndex: -1,
			selectedArenaEvent: new SpecialArenaEvent(""),
			arenaEventSearchTerm: "",

			showEventEditor: false,
			eventEditMode: "Add",
			showEventImporter: false,
			showArenaEventEditor: false,
			arenaEventEditMode: "Add",
			showArenaEventImporter: false
		}
		this.getArenaEvent = this.getArenaEvent.bind(this);
		this.getSelectedEvent = this.getSelectedEvent.bind(this);
		this.updateEventFilter = this.updateEventFilter.bind(this);
		this.updateArenaEventFilter = this.updateArenaEventFilter.bind(this);
		this.showEventEditor = this.showEventEditor.bind(this);
		this.hideEventEditor = this.hideEventEditor.bind(this);
		this.addEvent = this.addEvent.bind(this);
		this.editEvent = this.editEvent.bind(this);
		this.addArenaEvent = this.addArenaEvent.bind(this);
		this.editArenaEvent = this.editArenaEvent.bind(this);
		this.showArenaEventEditor = this.showArenaEventEditor.bind(this);
		this.hideArenaEventEditor = this.hideArenaEventEditor.bind(this);
		this.deleteEvent = this.deleteEvent.bind(this);
		this.deleteArenaEvent = this.deleteArenaEvent.bind(this);
		this.showEventImporter = this.showEventImporter.bind(this);
		this.hideEventImporter = this.hideEventImporter.bind(this)
		this.showArenaEventImporter = this.showArenaEventImporter.bind(this);
		this.hideArenaEventImporter = this.hideArenaEventImporter.bind(this);
		this.resetEvents = this.resetEvents.bind(this);
		this.resetSpecialEvents = this.resetSpecialEvents.bind(this);
	}
	
	showEventEditor(){
		this.setState({showEventEditor: true});
	}
	
	hideEventEditor(){
		this.setState({showEventEditor: false});
	}
	
	addEvent(){
		this.setState({eventEditMode: "Add", showEventEditor: true});
	}
	
	editEvent(){
		this.setState({eventEditMode: "Edit", showEventEditor: true});
	}
	
	addArenaEvent(){
		this.setState({arenaEventEditMode: "Add", showArenaEventEditor: true});
	}
	
	editArenaEvent(){
		this.setState({arenaEventEditMode: "Edit", showArenaEventEditor: true});
	}
	
	getArenaEvent(e){
		var x = parseInt((e.target.tagName === "BUTTON" ? e.target.id : e.target.parentElement.id).substr(10), 10);
		this.setState({selectedArenaEvent: this.props.specialArenaEvent[x],
						selectedArenaEventIndex: x});
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
	
	updateArenaEventFilter(e){
		this.setState({arenaEventSearchTerm: e.target.value});
		var st = this.state;
		if (st.selectedArenaEvent.leadText.toLowerCase().indexOf(st.arenaEventSearchTerm) === -1 &&
				st.selectedArenaEvent.nonFatalEvent.eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) === -1 &&
				st.selectedArenaEvent.fatalEvent[0].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) === -1 &&
				st.selectedArenaEvent.fatalEvent[1].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) === -1 &&
				st.selectedArenaEvent.fatalEvent[2].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) === -1 &&
				st.selectedArenaEvent.fatalEvent[3].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) === -1 &&
				st.selectedArenaEvent.fatalEvent[4].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) === -1){
			this.setState({selectedArenaEventIndex: -1});
		}
	}
	
	showArenaEventEditor(){
		this.setState({showArenaEventEditor: true});
	}
	
	hideArenaEventEditor(){
		this.setState({showArenaEventEditor: false});
	}
	
	deleteEvent(){
		this.props.arenaEvent.splice(this.state.selectedEventIndex, 1);
		this.setState({selectedEventIndex: -1});
	}
	
	deleteArenaEvent(){
		this.props.specialArenaEvent.splice(this.state.selectedArenaEventIndex, 1);
		this.setState({selectedArenaEventIndex: -1});
	}
	
	showEventImporter(){
		this.setState({showEventImporter: true});
	}
	hideEventImporter(){
		this.setState({showEventImporter: false, selectedEvent: new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 0}]), selectedEventIndex: -1});
	}
	
	showArenaEventImporter(){
		this.setState({showArenaEventImporter: true});
	}
	hideArenaEventImporter(){
		this.setState({showArenaEventImporter: false, selectedArenaEventIndex: -1, selectedArenaEvent: new SpecialArenaEvent("")});
	}
	
	resetEvents(){
		
		this.props.resetEvents();
		this.setState({selectedEvent: new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 0}]), selectedEventIndex: -1});
	}
	
	resetSpecialEvents(){
		this.props.resetSpecialEvents();
		this.setState({selectedArenaEventIndex: -1, selectedArenaEvent: new SpecialArenaEvent("")});
	}
	
	render(){
		var eventList = [], arenaEventList = [], pr = this.props, st = this.state;

		for (var i = 0; i < pr.arenaEvent.length; i++){
			if(pr.arenaEvent[i].eventText.toLowerCase().indexOf(st.eventSearchTerm) > -1){
				eventList.push(<option key = {i} value = {i}>{pr.arenaEvent[i].eventText}</option>);
			}
		}
		if (eventList.length > 0) eventList.unshift(<option key = {-1} value = {-1} disabled hidden></option>);
		
		for (i = 0; i < pr.specialArenaEvent.length; i++){
			if(pr.specialArenaEvent[i].leadText.toLowerCase().indexOf(st.arenaEventSearchTerm) > -1||
				pr.specialArenaEvent[i].nonFatalEvent.eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) > -1||
				pr.specialArenaEvent[i].fatalEvent[0].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) > -1||
				pr.specialArenaEvent[i].fatalEvent[1].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) > -1||
				pr.specialArenaEvent[i].fatalEvent[2].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) > -1||
				pr.specialArenaEvent[i].fatalEvent[3].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) > -1||
				pr.specialArenaEvent[i].fatalEvent[4].eventText.toLowerCase().indexOf(st.arenaEventSearchTerm) > -1){
				arenaEventList.push(<ListGroupItem key = {i} id = {"arenaEvent" + i} header = {pr.specialArenaEvent[i].leadText}
										active = {st.selectedArenaEventIndex === i} onClick = {this.getArenaEvent}>
										{pr.specialArenaEvent[i].nonFatalEvent.eventText}<br/>
										{pr.specialArenaEvent[i].fatalEvent[0].eventText}<br/>
										{pr.specialArenaEvent[i].fatalEvent[1].eventText}<br/>
										{pr.specialArenaEvent[i].fatalEvent[2].eventText}<br/>
										{pr.specialArenaEvent[i].fatalEvent[3].eventText}<br/>
										{pr.specialArenaEvent[i].fatalEvent[4].eventText}
										</ListGroupItem>)
			}
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
			<h4>{st.selectedEvent.eventText}</h4>
			Event scope: {scopeList}<br/>
			Killer: {killers.length > 0 ? killerList : "None"}<br/>
			Killed: {victims.length > 0 ? killedList : "None"}
			</div>)
		}
		
		if (st.selectedArenaEventIndex > -1){
			var fatalEventList = [];
			for (i = 0; i < 5; i++){
				killers = [];
				victims = [];
				killerList = "";
				killedList = "";
				for (var j = 0; j < st.selectedArenaEvent.fatalEvent[i].playerCount; j++){
					if (st.selectedArenaEvent.fatalEvent[i].p[j].isKiller) killers.push(j);
					if (st.selectedArenaEvent.fatalEvent[i].p[j].deathType > 0) victims.push(j);
				}
				for (j = 0; j < killers.length; j++){
					killerList += (j > 0 ? ", " : "") + "Player" + (killers[j] + 1);
				}
				for (j = 0; j < victims.length; j++){
					killedList += (j > 0 ? ", " : "") + "Player" + (victims[j] + 1);
				}
				fatalEventList.push(<div key = {i}>
					{st.selectedArenaEvent.fatalEvent[i].eventText}<br/>
					Killer: {killers.length > 0 ? killerList : "None"}<br/>
					Killed: {victims.length > 0 ? killedList : "None"}
					</div>);
			}
			var arenaEventDesc = (<div>
			<h5><b>{st.selectedArenaEvent.leadText}</b></h5>
			<h6><b>Non-fatal event</b></h6>
			{st.selectedArenaEvent.nonFatalEvent.eventText}
			<h6><b>Fatal events</b></h6>
			{fatalEventList}
			</div>)
		}
		
		return (<div>
			<Row>
				<Col sm = {10}>
					<FormControl type = "text" placeholder = "Search event" value = {st.eventSearchTerm} onChange = {this.updateEventFilter}/>
					<FormControl componentClass = "select" size = {6} value = {st.selectedEventIndex} onChange = {this.getSelectedEvent}>{eventList}</FormControl>
					{st.selectedEventIndex === -1 ? (<div>Click on an event in the list to see its description<br/><br/><br/><br/></div>) : eventDesc}
				</Col>
				<Col sm = {2}>
					<ButtonGroup vertical bsSize = "sm">
						<Button onClick = {this.addEvent}>Add new event</Button>
						<Button disabled = {st.selectedEventIndex === -1} onClick = {this.editEvent}>Edit event</Button>
						<Button disabled = {st.selectedEventIndex === -1} onClick = {this.deleteEvent}>Delete event</Button>
						<Button onClick = {this.showEventImporter}>Import events</Button>
						<Button disabled = {JSON.stringify(DefaultEvent) === JSON.stringify(pr.arenaEvent)} onClick = {this.resetEvents}>Restore defaults</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<Row>
				<Col sm = {5}>
					<FormControl type = "text" placeholder = "Search arena event" value = {st.arenaEventSearchTerm} onChange = {this.updateArenaEventFilter}/>
					<ListGroup id = "arenaEventSearchResult">{arenaEventList}</ListGroup>
				</Col>
				<Col sm = {5}>
					{st.selectedArenaEventIndex > -1 && arenaEventDesc}
				</Col>
				<Col sm = {2}>
					<ButtonGroup vertical bsSize = "sm">
						<Button onClick = {this.addArenaEvent}>Add new arena event</Button>
						<Button disabled = {st.selectedArenaEventIndex === -1} onClick = {this.editArenaEvent}>Edit arena event</Button>
						<Button disabled = {st.selectedArenaEventIndex === -1} onClick = {this.deleteArenaEvent}>Delete arena event</Button>
						<Button onClick = {this.showArenaEventImporter}>Import arena events</Button>
						<Button disabled = {JSON.stringify(DefaultSpecialEvent) === JSON.stringify(pr.specialArenaEvent)} onClick = {this.resetSpecialEvents}>Restore defaults</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<EventEditor show = {st.showEventEditor} hide = {this.hideEventEditor} arenaEvent = {pr.arenaEvent}
			mode = {st.eventEditMode} selectedEvent = {st.eventEditMode === "Edit" && st.selectedEvent}/>
			<EventImporter show = {st.showEventImporter} hide = {this.hideEventImporter} arenaEvent = {pr.arenaEvent}/>
			<ArenaEventEditor show = {st.showArenaEventEditor} hide = {this.hideArenaEventEditor} specialArenaEvent = {pr.specialArenaEvent}
			mode = {st.arenaEventEditMode} selectedArenaEvent = {st.arenaEventEditMode === "Edit" && st.selectedArenaEvent}/>
			<ArenaEventImporter show = {st.showArenaEventImporter} hide = {this.hideArenaEventImporter} specialArenaEvent = {pr.specialArenaEvent}/>
		</div>);
	}
}

function pronoun(n){
	return new RegExp("([(]his/her" + n + "[)]|[(]him/her" + n + "[)]|[(]he/she" + n + "[)]|[(]himself/herself" + n + "[)])", "i");
}

function pl(n){
	return ("[(]Player" + n + "[)]");
}

function isValidEvent(evt){
	var hasEventTextError = false;
	for (var i = 0; i < evt.playerCount; i++){
		if (evt.eventText.search(pl(i + 1)) === -1){
			console.log("Player " + (i + 1) + " not mentioned in event text");
			hasEventTextError = true;
			if (evt.eventText.search(pronoun(i + 1)) > -1){
				console.log("Pronoun for unmentioned tribute detected");
				hasEventTextError = true;
			}
		}
	}
	for (i = evt.playerCount; i < 6; i++){
		if (evt.eventText.search(pl(i + 1)) > 1||evt.eventText.search(pronoun(i + 1)) > -1){
			console.log("Unnecessary mention of Player " + (i + 1));
			hasEventTextError = true;
		}
	}
	var hasNoKillers = false;
	if (evt.killers() === 0 && evt.deaths() > 0){
		for (i = 0; i < evt.p.length; i++){
			if (evt.p[i].deathType === 1){
				console.log("At least one killer needed");
				hasNoKillers = true;
			}
		}
	}
	return (!(hasNoKillers || hasEventTextError));
}

class EventEditor extends Component{
	constructor(props){
		super(props);
		this.state = {
			currentEvent: new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 0}])
		}
		this.updateEventText = this.updateEventText.bind(this);
		this.initializeValues = this.initializeValues.bind(this);
		this.toggleScope = this.toggleScope.bind(this);
		this.toggleSharedKill = this.toggleSharedKill.bind(this);
		this.toggleKiller = this.toggleKiller.bind(this);
		this.toggleVictim = this.toggleVictim.bind(this);
		this.setDeathType = this.setDeathType.bind(this);
		this.setTribCount = this.setTribCount.bind(this);
		this.saveEvent = this.saveEvent.bind(this);
	}
	initializeValues(){
		this.setState({currentEvent: (this.props.mode === "Edit" ? Object.assign(this.state.currentEvent, this.props.selectedEvent) : new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 0}]))}); //direct assignment will overwrite the original
	}
	updateEventText(e){
		this.setState({currentEvent: Object.assign(this.state.currentEvent, {eventText: e.target.value})});
	}
	toggleScope(e){
		var val = this.state.currentEvent.scope + (parseInt(e.target.id.substr(5), 10) * (e.target.checked ? 1 : -1));
		this.setState({currentEvent: Object.assign(this.state.currentEvent, {scope: val})});
	}
	toggleSharedKill(e){
		this.setState({currentEvent: Object.assign(this.state.currentEvent, {isSharedKill: e.target.checked})});
	}
	toggleKiller(e){
		var pl = [];
		for (var i = 0; i < this.state.currentEvent.playerCount; i++){
			pl.push(this.state.currentEvent.p[i]);
		}
		pl[e.target.id.substr(8)].isKiller = e.target.checked;
		this.setState({currentEvent: Object.assign(this.state.currentEvent, {p: pl})});
	}
	toggleVictim(e){
		var pl = [];
		for (var i = 0; i < this.state.currentEvent.playerCount; i++){
			pl.push(this.state.currentEvent.p[i]);
		}
		pl[e.target.id.substr(8)].deathType = e.target.checked ? 1 : 0;
		if(pl.filter(function countKilled(p){return p.deathType > 0}).length === 0){
			for (i = 0; i < this.state.currentEvent.playerCount; i++){
				pl[i].isKiller = false;
			}
		}
		this.setState({currentEvent: Object.assign(this.state.currentEvent, {p: pl})});
	}
	setDeathType(e){
		var pl = [];
		for (var i = 0; i < this.state.currentEvent.playerCount; i++){
			pl.push(this.state.currentEvent.p[i]);
		}
		pl[e.target.id.substr(9)].deathType = e.target.value;
		this.setState({currentEvent: Object.assign(this.state.currentEvent, {p: pl})});
	}
	setTribCount(e){
		if (isValidNumInput(e.target)){
			var pl = [];
			for (var i = 0; i < e.target.value; i++){
				pl.push(i < this.state.currentEvent.playerCount ? this.state.currentEvent.p[i] : {isKiller: false, deathType: 0});
			}
			this.setState({currentEvent: Object.assign(this.state.currentEvent, {playerCount: e.target.value, p: pl})});
		}
	}
	saveEvent(){
		var st = this.state, pr = this.props;
		if (st.currentEvent.eventText === ""){
			console.log("Cannot leave event text empty");
		}
		else{
			var matchFound = false;
			for (var i = 0; i < pr.arenaEvent.length; i++){
				if (pr.arenaEvent[i].eventText === st.currentEvent.eventText){
					matchFound = true;
					break;
				}
			}
			if (matchFound){
				console.log("Event already exists.");
			}
			else if (st.currentEvent.scope === 0){
				console.log("No scope selected");
			}
			else if (isValidEvent(st.currentEvent)){
				pr.arenaEvent.push(st.currentEvent);
				localStorage.setItem("HGEvent", JSON.stringify(pr.arenaEvent));
				pr.hide();
			}
		}

	}
	render(){
		var st = this.state, pr = this.props, playerStatus = [];
		for (var i = 0; i < st.currentEvent.playerCount; i++){
			playerStatus.push(<Row key = {i}>
			<Col sm = {3}><ControlLabel>{"Player " + (i + 1)}</ControlLabel></Col>
			<Col sm = {3}><Checkbox id = {"isKiller" + i} checked = {st.currentEvent.p[i].isKiller} onChange = {this.toggleKiller} disabled = {this.state.currentEvent.deaths() === 0}/></Col>
			<Col sm = {3}><Checkbox id = {"isKilled" + i} checked = {st.currentEvent.p[i].deathType > 0} onChange = {this.toggleVictim}/></Col>
			<Col sm = {3}>
				<FormControl id = {"deathType" + i} componentClass = "select" value = {st.currentEvent.p[i].deathType} onChange = {this.setDeathType}>
					<option hidden value = {0}/>
					<option value = {1}>Combat death</option>
					<option value = {2}>Suicide</option>
					<option value = {3}>Other</option>
				</FormControl>
			</Col>
			</Row>);
		}
		return(
		<Modal backdrop = "static" show = {pr.show} onHide = {pr.hide} onEnter = {this.initializeValues}>
			<Modal.Header closeButton>
				<Modal.Title>{pr.mode + " event"}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<InputGroup>
					<InputGroup.Addon>Event text</InputGroup.Addon>
					<FormControl type = "text" value = {st.currentEvent.eventText} onChange = {this.updateEventText}/>
				</InputGroup>
				<InputGroup>
					<InputGroup.Addon>Number of tributes involved</InputGroup.Addon>
					<FormControl componentClass = "input" type = "number" min = {1} max = {6} value = {st.currentEvent.playerCount} onChange = {this.setTribCount}/>
				</InputGroup>
				<FormGroup>
					<Col componentClass = {ControlLabel} sm = {3}>Event scope</Col>
					<Col sm = {2}>
						<Checkbox inline id = "scope1" checked = {st.currentEvent.isBloodbathEvent()} onChange = {this.toggleScope}>Bloodbath</Checkbox>
					</Col>
					<Col sm = {2}>
						<Checkbox inline id = "scope2" checked = {st.currentEvent.isDayEvent()} onChange = {this.toggleScope}>Day</Checkbox>
					</Col>
					<Col sm = {2}>
						<Checkbox inline id = "scope4" checked = {st.currentEvent.isNightEvent()} onChange = {this.toggleScope}>Night</Checkbox>
					</Col>
					<Col sm = {2}>
						<Checkbox inline id = "scope8" checked = {st.currentEvent.isFeastEvent()} onChange = {this.toggleScope}>Feast</Checkbox>
					</Col>
				</FormGroup>

				<Checkbox inline checked = {st.currentEvent.isSharedKill} onChange = {this.toggleSharedKill} disabled = {st.currentEvent.p.filter(function countKillers(pl){return pl.isKiller === true}).length < 2}>Is kill shared?</Checkbox>
					<Row>
						<Col sm = {3}/>
						<Col sm = {3}>Is killer?</Col>
						<Col sm = {3}>Is killed?</Col>
						<Col sm = {3}>Death type</Col>
					</Row>
					{playerStatus}
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle = "default" onClick = {this.saveEvent}>Submit</Button>
				<Button bsStyle = "danger" onClick = {pr.hide}>Cancel</Button>
			</Modal.Footer>
		</Modal>)
	}
}

class ArenaEventEditor extends Component{
	constructor(props){
		super(props);	
		
		this.state = {activeTab: 0,
						currentArenaEvent: new SpecialArenaEvent("")};
		
		this.switchToTab = this.switchToTab.bind(this);
		this.initializeValues = this.initializeValues.bind(this);
		this.setNonFatalEventText = this.setNonFatalEventText.bind(this);
		this.setFatalEventText = this.setFatalEventText.bind(this);
		
		this.toggleKiller = this.toggleKiller.bind(this);
		this.toggleVictim = this.toggleVictim.bind(this);
		this.setDeathType = this.setDeathType.bind(this);
		this.setTribCount = this.setTribCount.bind(this);
		this.setLeadText = this.setLeadText.bind(this);
		this.saveArenaEvent = this.saveArenaEvent.bind(this);
	}
	
	initializeValues(){
		var pr = this.props;
		if (pr.mode === "Edit"){
			pr.selectedArenaEvent.nonFatalEvent = Object.assign(new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 0}]), pr.selectedArenaEvent.nonFatalEvent);
			for (var i = 0; i < 5; i++){
				pr.selectedArenaEvent.fatalEvent[i] = Object.assign(new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 0}]), pr.selectedArenaEvent.fatalEvent[i]);
			}
		}
		this.setState({activeTab: 0,
						currentArenaEvent: (this.props.mode === "Edit" ? Object.assign(new SpecialArenaEvent(""), pr.selectedArenaEvent) : new SpecialArenaEvent(""))}); //direct assignment will overwrite the original
	}
	
	switchToTab(key){
		this.setState({activeTab: key});
	}
	
	setNonFatalEventText(e){
		var details = Object.assign({}, this.state.currentArenaEvent.nonFatalEvent); //direct assignment will modify original
		details.eventText = e.target.value;
		this.setState({currentArenaEvent: Object.assign(this.state.currentArenaEvent, {nonFatalEvent: details})});
	}
	
	setFatalEventText(e){
		var fatalEvents = [];
		for (var i = 0; i < 5; i++){
			fatalEvents.push(this.state.currentArenaEvent.fatalEvent[i]);
		}
		fatalEvents[e.target.id.substr(14)].eventText = e.target.value;
		this.setState({currentArenaEvent: Object.assign(this.state.currentArenaEvent, {fatalEvent: fatalEvents})});
	}

	toggleKiller(e){
		var fatalEvents = [];
		for (var i = 0; i < 5; i++){
			fatalEvents.push(this.state.currentArenaEvent.fatalEvent[i]);
		}
		var rawId = e.target.id.substr(8);
		fatalEvents[(rawId - (rawId % 6)) / 6].p[rawId % 6].isKiller = e.target.checked;
		this.setState({currentArenaEvent: Object.assign(this.state.currentArenaEvent, {fatalEvent: fatalEvents})});
	}
	
	toggleVictim(e){
		var fatalEvents = [];
		for (var i = 0; i < 5; i++){
			fatalEvents.push(this.state.currentArenaEvent.fatalEvent[i]);
		}
		var rawId = e.target.id.substr(8), fatalEvtNo = ((rawId - (rawId % 6)) / 6);
		fatalEvents[fatalEvtNo].p[rawId % 6].deathType = e.target.checked ? 1 : 0;
		if(fatalEvents[fatalEvtNo].deaths() === 0){
			for (i = 0; i < fatalEvents[fatalEvtNo].playerCount; i++){
				fatalEvents[fatalEvtNo].p[i].isKiller = false;
			}
		}
		this.setState({currentArenaEvent: Object.assign(this.state.currentArenaEvent, {fatalEvent: fatalEvents})});
	}
	
	setDeathType(e){
		var fatalEvents = [];
		for (var i = 0; i < 5; i++){
			fatalEvents.push(this.state.currentArenaEvent.fatalEvent[i]);
		}
		var rawId = e.target.id.substr(9);
		fatalEvents[(rawId - (rawId % 6)) / 6].p[rawId % 6].deathType = e.target.value;
		this.setState({currentArenaEvent: Object.assign(this.state.currentArenaEvent, {fatalEvent: fatalEvents})});
	}
	
	setTribCount(e){
		if (isValidNumInput(e.target)){
			var fatalEvents = [], pl = [];
			for (var i = 0; i < 5; i++){
				fatalEvents.push(this.state.currentArenaEvent.fatalEvent[i]);
			}
			var num = e.target.id.substr(9);
			for (i = 0; i < e.target.value; i++){
				pl.push(i < fatalEvents[num].playerCount ? fatalEvents[num].p[i] : {isKiller: false, deathType: 0});
			}
			fatalEvents[num].playerCount = e.target.value;		
			fatalEvents[num].p = pl
			this.setState({currentArenaEvent: Object.assign(this.state.currentArenaEvent, {fatalEvent: fatalEvents})});
		}
	}
	
	setLeadText(e){
		this.setState({currentArenaEvent: Object.assign(this.state.currentArenaEvent, {leadText: e.target.value})});
	}
	
	saveArenaEvent(){
		var st = this.state, pr = this.props;
		if (st.currentArenaEvent.leadText === "" || st.currentArenaEvent.nonFatalEvent.eventText === "" ||
			st.currentArenaEvent.fatalEvent[0].eventText === "" || st.currentArenaEvent.fatalEvent[1].eventText === "" ||
			st.currentArenaEvent.fatalEvent[2].eventText === "" || st.currentArenaEvent.fatalEvent[3].eventText === "" ||
			st.currentArenaEvent.fatalEvent[4].eventText === ""){
				console.log("Event text cannot be empty");
			}
		else{
			var hasClone = false;
			for (var i = 0; i < pr.specialArenaEvent.length; i++){
				if (st.currentArenaEvent.leadText === pr.specialArenaEvent[i].leadText){
					if (st.currentArenaEvent.nonFatalEvent.eventText === pr.specialArenaEvent[i].nonFatalEvent.eventText){
						var fatalEventMatch = true;
						for (var j = 0; j < 5; j++){
							if (st.currentArenaEvent.fatalEvent[i].eventText !== pr.specialArenaEvent.fatalEvent[i].eventText){
								fatalEventMatch = false;
								break;
							}
						}
						if (fatalEventMatch){
							hasClone = true;
							break;
						}
					}
				}
			}
			if (hasClone){
				console.log("Event already exists");
			}
			else{
				var hasNoKills = false;
				for (i = 1; i < 5; i++){
					if (st.currentArenaEvent.fatalEvent[i].deaths === 0){
						console.log("A fatal subevent has no kills");
						hasNoKills = true;
						break;
					}
				}
				if (!hasNoKills){
					var hasBuggedSubevent = false;
					if (isValidEvent(st.currentArenaEvent.nonFatalEvent)) hasBuggedSubevent = true;
					for (i = 0; i < 5; i++){
						if (isValidEvent(st.currentArenaEvent.fatalEvent[i])){
							hasBuggedSubevent = true;
							break;
						}
					}
					if (hasBuggedSubevent){
						console.log("One of the subevents has a problem");
					}
					else{
						pr.specialArenaEvent.push(st.currentArenaEvent);
						localStorage.setItem("HGSpecEvent", JSON.stringify(pr.specialArenaEvent));
						pr.hide();
					}
				}
			}
		}

	}
	
	render(){
		var pr = this.props, st = this.state, fatalEventTabs = [];
		for (var i = 0; i < 5; i++){
			var playerStatus = [];
			for (var j = 0; j < st.currentArenaEvent.fatalEvent[i].playerCount; j++){
				playerStatus.push(<Row key = {j}>
				<Col sm = {3}><ControlLabel>{"Player " + (j + 1)}</ControlLabel></Col>
				<Col sm = {3}><Checkbox id = {"isKiller" + (i * 6 + j)} checked = {st.currentArenaEvent.fatalEvent[i].p[j].isKiller} onChange = {this.toggleKiller} disabled = {st.currentArenaEvent.fatalEvent[i].deaths() === 0}/></Col>
				<Col sm = {3}><Checkbox id = {"isKilled" + (i * 6 + j)} checked = {st.currentArenaEvent.fatalEvent[i].p[j].deathType > 0} onChange = {this.toggleVictim}/></Col>
				<Col sm = {3}>
					<FormControl id = {"deathType" + (i * 6 + j)} componentClass = "select" value = {st.currentArenaEvent.fatalEvent[i].p[j].deathType} onChange = {this.setDeathType}>
						<option hidden value = {0}/>
						<option value = {1}>Combat death</option>
						<option value = {2}>Suicide</option>
						<option value = {3}>Other</option>
					</FormControl>
				</Col>
				</Row>);
			}
			fatalEventTabs.push(<Tab key = {i} eventKey = {i + 1} title = {"Fatal event " + (i + 1)}>
				<FormControl id = {"fatalEventText" + i} type = "text" value = {st.currentArenaEvent.fatalEvent[i].eventText} onChange = {this.setFatalEventText}/>
				<InputGroup>
					{i > 0 && <InputGroup.Addon>Number of tributes involved</InputGroup.Addon>}
					{i > 0 ? <FormControl id = {"tribCount" + i} componentClass = "input" type = "number" min = {1} max = {6}
						value = {st.currentArenaEvent.fatalEvent[i].playerCount} onChange = {this.setTribCount}/> :
						<div>Number of tributes involved: 1</div> }
						
				</InputGroup>				
				<Row>
					<Col sm = {3}/>
					<Col sm = {3}>Is killer?</Col>
					<Col sm = {3}>Is killed?</Col>
					<Col sm = {3}>Death type</Col>
				</Row>
				{playerStatus}
			</Tab>);
		}
		return(<Modal bsSize = "lg" backdrop = "static" show = {pr.show} onHide = {pr.hide} onEnter = {this.initializeValues}>
			<Modal.Header closeButton>
				<Modal.Title>{pr.mode + " arena event"}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<FormControl type = "text" value = {st.currentArenaEvent.leadText} onChange = {this.setLeadText} />
			<Tabs activeKey = {st.activeTab} onSelect = {this.switchToTab} id = "arenaEventOutcomes">
				<Tab eventKey = {0} title = "Non-fatal event">
					<FormControl type = "text" value = {st.currentArenaEvent.nonFatalEvent.eventText} onChange = {this.setNonFatalEventText}/>
					Number of tributes involved: 1
				</Tab>
				{fatalEventTabs}
			</Tabs>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle = "default" onClick = {this.saveArenaEvent}>Submit</Button>
				<Button bsStyle = "danger" onClick = {pr.hide}>Cancel</Button>
			</Modal.Footer>
		</Modal>
		)
	}
}

class EventImporter extends Component{
	constructor(props){
		super(props);
		this.state = {rawText: "", eventScope: 0};
		this.setRawText = this.setRawText.bind(this);
		this.appendEvents = this.appendEvents.bind(this);
		this.parseText = this.parseText.bind(this);
		this.overwriteEvents = this.overwriteEvents.bind(this);
		this.toggleScope = this.toggleScope.bind(this);
		this.initializeValues = this.initializeValues.bind(this);
		this.pushEvents = this.pushEvents.bind(this);
	}
	
	setRawText(e){
		this.setState({rawText: e.target.value});
	}
	
	appendEvents(){
		var eventQueue = this.parseText();
		if (eventQueue.length > 0){
			this.pushEvents(eventQueue);
		}
	}
	
	pushEvents(eventQueue){
		for (var i = 0; i < eventQueue.length; i++){
			var matchFound = false, pr = this.props;
			for (var j = 0; j < pr.arenaEvent.length; j++){
				if (pr.arenaEvent[j].eventText === eventQueue[i].eventText){
					matchFound = true;
					if (!pr.arenaEvent[j].isBloodbathEvent() && eventQueue[i].isBloodbathEvent()) pr.arenaEvent[j].scope += 1;
					if (!pr.arenaEvent[j].isDayEvent() && eventQueue[i].isDayEvent()) pr.arenaEvent[j].scope += 2;
					if (!pr.arenaEvent[j].isNightEvent() && eventQueue[i].isNightEvent()) pr.arenaEvent[j].scope += 4;
					if (!pr.arenaEvent[j].isFeastEvent() && eventQueue[i].isFeastEvent()) pr.arenaEvent[j].scope += 8;
					break;
				}
			}
			if(!matchFound && isValidEvent(eventQueue[i])){
				pr.arenaEvent.push(eventQueue[i]);
			}
		}
		localStorage.setItem("HGEvent", JSON.stringify(pr.arenaEvent));
	}
	
	initializeValues(){
		this.setState({rawText: "", eventScope: 0});
	}
	
	parseText(){
		var eventQueue = [], eventHeader = /#[0-9]+[.].+/, tribCtr = /\nTributes: [1-6]/,
		killerDisplay = /\nKiller: (None|(Player[1-6][,] ){1,5}Player[1-6]|Player[1-6])/,
		killedDisplay = /\nKilled: ((Player[1-6][,] ){1,5}Player[1-6]|Player[1-6])/,
		killPanel = new RegExp(killerDisplay.source + killedDisplay.source), footer = /(?=[\n]+Remove)/;
		if (this.state.eventScope > 0){
			var nonFatalEvents = this.state.rawText.match(new RegExp(eventHeader.source + tribCtr.source + footer.source, "g"));
			var fatalEvents = this.state.rawText.match(new RegExp(eventHeader.source + tribCtr.source + killPanel.source, "g"));
			var result = [];
			if (nonFatalEvents){
				result = fatalEvents ? nonFatalEvents.push(...fatalEvents) : nonFatalEvents;
			}
			else if (fatalEvents){
				result = fatalEvents;
			}
			else{
				console.log("No matches found");
			}
			
			for (var i = 0; i < result.length; i++){
				var newEvent = new ArenaEvent("", 0, 1, []), line = result[i].split("\n");
				newEvent.eventText = line[0].slice(line[0].indexOf(".") + 2);
				newEvent.playerCount = parseInt(line[1].slice(10), 10);
				newEvent.scope = this.state.eventScope;
				if (line.length > 2){
					for (var j = 0; j < newEvent.playerCount; j++){
						newEvent.p.push({isKiller: (line[2].search("Player" + (j + 1)) > -1), deathType: 0});
						if (newEvent.p[j].isKiller && line[3].search("Player" + (j + 1)) > -1){
							newEvent.p[j].deathType = 2;
						}
					}
					for (j = 0; j < newEvent.playerCount; j++){
						if (line[3].search("Player" + (j + 1)) > -1){
							newEvent.p[j].deathType = (newEvent.killers() > 0 ? 1 : 3);
						}
					}
					newEvent.isSharedKill = newEvent.killers() > 1;
				}
				else{
					for (j = 0; j < newEvent.playerCount; j++){
						newEvent.p.push({isKiller: false, deathType: 0});
					}
				}
				eventQueue.push(newEvent);
			}
		}	
		else console.log("No scope selected");
		return (eventQueue);
	}
	
	overwriteEvents(){
		var eventQueue = this.parseText(), pr = this.props;
		if (eventQueue.length > 0){
			pr.arenaEvent.splice(0, pr.arenaEvent.length);
			this.pushEvents(eventQueue);
		}
	}
	
	toggleScope(e){
		var val = this.state.eventScope + (parseInt(e.target.id.substr(5), 10) * (e.target.checked ? 1 : -1));
		this.setState({eventScope: val});
	}
	
	render(){
		var pr = this.props, st = this.state;
		return (<Modal backdrop = "static" show = {pr.show} onHide = {pr.hide} onEnter = {this.initializeValues}>
			<Modal.Header closeButton>
				<Modal.Title>{"Import events"}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormControl componentClass = "textarea" placeholder = "Paste event list here" value = {st.rawText} onChange = {this.setRawText}/>
				<FormGroup>
					<Col componentClass = {ControlLabel} sm = {3}>Event scope</Col>
					<Col sm = {2}>
						<Checkbox inline id = "scope1" checked = {st.eventScope % 2 === 1} onChange = {this.toggleScope}>Bloodbath</Checkbox>
					</Col>
					<Col sm = {2}>
						<Checkbox inline id = "scope2" checked = {(st.eventScope >> 1) % 2 === 1} onChange = {this.toggleScope}>Day</Checkbox>
					</Col>
					<Col sm = {2}>
						<Checkbox inline id = "scope4" checked = {(st.eventScope >> 2) % 2 === 1} onChange = {this.toggleScope}>Night</Checkbox>
					</Col>
					<Col sm = {2}>
						<Checkbox inline id = "scope8" checked = {(st.eventScope >> 3) % 2 === 1} onChange = {this.toggleScope}>Feast</Checkbox>
					</Col>
				</FormGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle = "default" onClick = {this.appendEvents}>Append</Button>
				<Button bsStyle = "warning" onClick = {this.overwriteEvents}>Overwrite</Button>
				<Button bsStyle = "danger" onClick = {pr.hide}>Close</Button>
			</Modal.Footer>
		</Modal>)
	}
}

class ArenaEventImporter extends Component{
	constructor(props){
		super(props);
		this.state = {rawText: ""};
		this.initializeValues = this.initializeValues.bind(this);
		this.setRawText = this.setRawText.bind(this);
		this.parseText = this.parseText.bind(this);
		this.appendEvents = this.appendEvents.bind(this);
		this.overwriteEvents = this.overwriteEvents.bind(this);
		this.pushEvents = this.pushEvents.bind(this);
	}
	
	setRawText(e){
		this.setState({rawText: e.target.value});
	}
	
	initializeValues(){
		this.setState({rawText: ""});
	}
	
	appendEvents(){
		var eventQueue = this.parseText();
		if (eventQueue.length > 0){
			this.pushEvents(eventQueue);
		}
	}
	
	overwriteEvents(){
		var eventQueue = this.parseText(), pr = this.props;
		if (eventQueue.length > 0){
			pr.specialArenaEvent.splice(0, pr.specialArenaEvent.length);
			this.pushEvents(eventQueue);
		}
	}
	
	pushEvents(eventQueue){
		for (var i = 0; i < eventQueue.length; i++){
			var matchFound = false, pr = this.props;
			for (var j = 0; j < pr.specialArenaEvent.length; j++){
				if (pr.specialArenaEvent[j].leadText === eventQueue[i].leadText &&
					pr.specialArenaEvent[j].nonFatalEvent.eventText === eventQueue[i].nonFatalEvent.eventText &&
					pr.specialArenaEvent[j].fatalEvent[0].eventText === eventQueue[i].fatalEvent[0].eventText &&
					pr.specialArenaEvent[j].fatalEvent[1].eventText === eventQueue[i].fatalEvent[1].eventText &&
					pr.specialArenaEvent[j].fatalEvent[2].eventText === eventQueue[i].fatalEvent[2].eventText &&
					pr.specialArenaEvent[j].fatalEvent[3].eventText === eventQueue[i].fatalEvent[3].eventText &&
					pr.specialArenaEvent[j].fatalEvent[4].eventText === eventQueue[i].fatalEvent[4].eventText){
					matchFound = true;
					break;
				}
			}
			if(!matchFound && isValidEvent(eventQueue[i].nonFatalEvent) && isValidEvent(eventQueue[i].fatalEvent[0]) &&
				isValidEvent(eventQueue[i].fatalEvent[1]) && isValidEvent(eventQueue[i].fatalEvent[2]) &&
				isValidEvent(eventQueue[i].fatalEvent[3]) && isValidEvent(eventQueue[i].fatalEvent[4])){
				pr.specialArenaEvent.push(eventQueue[i]);
			}
		}
		localStorage.setItem("HGSpecEvent", JSON.stringify(pr.specialArenaEvent));
	}
	
	parseText(){
		var eventQueue = [], eventHeader = /#[0-9]+[.].+/, subEvent1Header = /\n\n#[0-9]+-1[.].+/,
			fatalSubevent1 = /\n\n#[0-9]+-1[.].+\nTributes: 1\nKiller: None\nKilled: Player1/, 
			otherSubeventHeader = /\n\n#[0-9]+-[2-5][.].+/, oneTrib = /\nTributes: 1/, tribCtr = /\nTributes: [1-6]/,
			killerDisplay = /\nKiller: (None|(Player[1-6][,] ){1,5}Player[1-6]|Player[1-6])/,
			killedDisplay = /\nKilled: ((Player[1-6][,] ){1,5}Player[1-6]|Player[1-6])/, killPanel = new RegExp(killerDisplay.source + killedDisplay.source),
			otherSubevent = new RegExp(otherSubeventHeader.source+tribCtr.source+killPanel.source),
			result = this.state.rawText.match(new RegExp(eventHeader.source + subEvent1Header.source +
			oneTrib.source + fatalSubevent1.source + otherSubevent.source + otherSubevent.source + otherSubevent.source + otherSubevent.source, "g"));
			
		if (result){
			for (var i = 0; i < result.length; i++){
				var newEvent = new SpecialArenaEvent(""), line = result[i].split("\n");
				newEvent.leadText = line[0].slice(line[0].indexOf(".") + 2);
				newEvent.nonFatalEvent.eventText = line[2].slice(line[2].indexOf(".") + 2);
				for (var j = 0; j < 5; j++){
					newEvent.fatalEvent[j].eventText = line[5 * (1 + j)].slice(line[5 * (1 + j)].indexOf(".") + 2);
					newEvent.fatalEvent[j].playerCount = parseInt(line[6 + (5 * j)].slice(10), 10);
					newEvent.fatalEvent[j].p = [];
					for (var k = 0; k < newEvent.fatalEvent[j].playerCount; k++){
						newEvent.fatalEvent[j].p.push({isKiller: false, deathType: 0});
						if (newEvent.fatalEvent[j].p[k].isKiller && line[7 + (5 * j)].search("Player" + (k + 1)) > -1){
							newEvent.fatalEvent[j].p[k].deathType = 2;
						}
					}
					for (k = 0; k < newEvent.fatalEvent[j].playerCount; k++){
						if (line[8 + (5 * j)].search("Player" + (k + 1)) > -1){
							newEvent.fatalEvent[j].p[k].deathType = (newEvent.fatalEvent[j].killers() > 0 ? 1 : 3);
						}
					}
					newEvent.fatalEvent[j].isSharedKill = newEvent.fatalEvent[j].killers() > 1;
				}
				eventQueue.push(newEvent);
			}
		}
		return (eventQueue);
	}
	
	render(){
		var pr = this.props, st = this.state;
		return (
		<Modal backdrop = "static" show = {pr.show} onHide = {pr.hide} onEnter = {this.initializeValues}>
			<Modal.Header closeButton>
				<Modal.Title>{"Import arena events"}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormControl componentClass = "textarea" placeholder = "Paste event list here" value = {st.rawText} onChange = {this.setRawText}/>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle = "default" onClick = {this.appendEvents}>Append</Button>
				<Button bsStyle = "warning" onClick = {this.overwriteEvents}>Overwrite</Button>
				<Button bsStyle = "danger" onClick = {pr.hide}>Close</Button>
			</Modal.Footer>
		</Modal>)
	}
}

class SettingsPanel extends Component{
	render(){
		return(<form>
	<FormGroup controlId="fatalEventFreq">
		<ControlLabel>Fatal event frequency</ControlLabel>
		<Radio name="radioGroup" inline>Very High</Radio>{' '}
		<Radio name="radioGroup" inline>High</Radio>{' '}
		<Radio name="radioGroup" inline>Medium</Radio>{' '}
		<Radio name="radioGroup" inline>Low</Radio>
	</FormGroup>
	<FormGroup controlId="defaultEventFreq">
		<ControlLabel>Default bloodbath/feast event frequency</ControlLabel>
		<Radio name="radioGroup2" inline>Normal</Radio>{' '}
		<Radio name="radioGroup2" inline>Reduced</Radio>{' '}
	  </FormGroup>
	<FormGroup controlId="arenaEventFreq">
		<ControlLabel>Arena event frequency</ControlLabel>
		<Radio name="radioGroup3" inline>High</Radio>{' '}
		<Radio name="radioGroup3" inline>Low</Radio>{' '}
		<Radio name="radioGroup3" inline>None</Radio>{' '}
	</FormGroup>
	<Checkbox inline>Show recent deaths</Checkbox>
	<Checkbox inline>Enable tribute watchlist and event filter</Checkbox>
		</form>)
	}
}

export default App;