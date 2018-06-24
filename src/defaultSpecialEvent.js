import ArenaEvent from './defaultEvent';

function SpecialArenaEvent(leadText){
	this.leadText = leadText;
	this.nonFatalEvent = new ArenaEvent("(Player1) survives.", 0, 1, [{isKiller: false, deathType: 0}]);
	this.fatalEvent = [new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 3}]),
	new ArenaEvent("", 0, 1, [{isKiller: false, deathType: 3}]),
	new ArenaEvent("", 0, 2, [{isKiller: true, deathType: 0}, {isKiller: false, deathType: 1}]),
	new ArenaEvent("", 0, 2, [{isKiller: true, deathType: 0}, {isKiller: false, deathType: 1}]),
	new ArenaEvent("", 0, 2, [{isKiller: false, deathType: 3}, {isKiller: false, deathType: 3}])
	]
}

var DefaultSpecialEvent = [];
var DefaultText = ["Wolf mutts are let loose in the arena", "Acidic rain pours down on the arena", "A cloud of poisonous smoke starts to fill the arena",
"A monstrous hurricane wreaks havoc on the arena", "A swarm of tracker jackers invades the arena", "A tsunami rolls into the the arena",
"A fire spreads throughout the arena", "The arena's border begins to rapidly contract", "Monkey mutts fill the arena", "Carnivorous squirrels start attacking the tributes",
"A volcano erupts at the center of the arena","The arena turns pitch black and nobody can see a thing", "The remaining tributes begin to hallucinate"]

var DefaultSubText = [
["(Player1) is crushed by a pack of wolf mutts","(Player1) is eaten by wolf mutts","(Player1) knocks (Player2) out and leaves (him/her2) for the wolf mutts",
"(Player1) pushes (Player2) into a pack of wolf mutts", "As (Player1) and (Player2) fight, a pack of wolf mutts show up and kill them both"],
["(Player1) is unable to find shelter and dies", "(Player1) trips face first into a puddle of acidic rain", "(Player1) injures (Player2) and leaves (him/her2) in the rain to die", "(Player1) refuses (Player2) shelter, killing (him/her2)",
"(Player1) shoves (Player2) into a pond of acidic rain, but is pulled in by (Player2), killing them both"],
["(Player1) is engulfed in the cloud of poisonous smoke", "(Player1) sacrifices (himself/herself1) so (Player2) can get away", "(Player1) slowly pushes (Player2) closer into the cloud until (he/she2) can't resist any more",
"(Player1) and (Player2) agree to die in the cloud together, but (Player1) pushes (Player2) in without warning", "(Player1) and (Player2) decide to run into the cloud together"],
["(Player1) is sucked into the hurricane", "(Player1) is incapacitated by flying debris and dies", "(Player1) pushes (Player2) into an incoming boulder",
"(Player1) stabs (Player2), then pushes (him/her2) close enough to the hurricane to suck (him/her2) in", "(Player1) tries to save (Player2) from being sucked into the hurricane, only to be sucked in as well"],
["(Player1) is stung to death", "(Player1) slowly dies from the tracker jacker toxins", "(Player1) knocks (Player2) unconscious and leaves (him/her2) there as bait",
"While running away from the tracker jackers, (Player1) grabs (Player2) and throws (him/her2) to the ground", "(Player1) and (Player2) run out of places to run and are stung to death"],
["(Player1) is swept away", "(Player1) fatally injures (himself/herself1) on debris", "(Player1) holds (Player2) underwater to drown","(Player1) defeats (Player2), but throws (him/her2) in the water to make sure (he/she2) dies",
"(Player1) and (Player2) smash their heads together as the tsunami rolls in, leaving them both to drown"],
["The fire catches up to (Player1), killing (him/her1)", "A fireball strikes (Player1), killing (him/her1)", "(Player1) kills (Player2) in order to utilize a body of water safely",
"(Player1) falls to the ground, but kicks (Player2) hard enough to then push (him/her2) into the fire", "(Player1) and (Player2) fail to find a safe spot and suffocate"],
["(Player1) is electrocuted by the border", "(Player1) trips on a tree root and is unable to recover fast enough", "(Player1) restrains (Player2) to a tree and leaves (him/her2) to die",
"(Player1) pushes (Player2) into the border while (he/she2) is not paying attention", "Thinking they could escape, (Player1) and (Player2) attempt to run through the border together"],
["(Player1) dies from internal bleeding caused by a monkey mutt", "(Player1) is pummeled to the ground and killed by a troop of monkey mutts", "(Player1) uses (Player2) as a shield from the monkey mutts",
"(Player1) injures (Player2) and leaves (him/her2) for the monkey mutts", "While running, (Player1) falls over and grabs (Player2) on the way down. The monkey mutts kill them"],
["(Player1) is brutally attacked by a scurry of squirrels", "(Player1) tries to kill as many squirrels as (he/she1) can, but there are too many", "(Player1) uses the squirrels to (his/her1) advantage, shoving (Player2) into them",
"(Player1), in agony, kills (Player2) so (he/she2) does not have to be attacked by the squirrels", "The squirrels separate and kill (Player1) and (Player2)"],
["(Player1) is buried in ash","(Player1) suffocates", "(Player1) pushes (Player2) in the lava", "(Player1) dips (his/her1) weapon in the lava and kills (Player2) with it",
"As (Player1) trips over (Player2) into the lava, (he/she1) grabs (him/her2) and pulls (him/her2) down with (him/her1)"],
["(Player1) trips on a rock and falls off a cliff","(Player1) accidently makes contact with spiny, lethal plant life", "(Player1) flails (his/her1) weapon around, accidently killing (Player2)",
 "(Player1) finds and kills (Player2), who was making too much noise", "While fighting, (Player1) and (Player2) lose their balance, roll down a jagged hillside, and die"],
["(Player1) eats a scorpion, thinking it is a delicate dessert", "(Player1) hugs a tracker jacker nest, believing it to be a pillow","(Player1) mistakes (Player2) for a bear and kills (him/her2)",
"(Player1) drowns (Player2), who (he/she1) thought was a shark trying to eat (him/her1)", "(Player1) and (Player2) decide to jump down the rabbit hole to Wonderland, which turns out to be a pit of rocks"]]

for(var i = 0; i < DefaultText.length; i++){
	DefaultSpecialEvent.push(new SpecialArenaEvent(DefaultText[i] + "."));
	for (var j = 0; j < 5; j++){
		DefaultSpecialEvent[i].fatalEvent[j].eventText = DefaultSubText[i][j] + ".";
	}
	if ([2, 7, 12].indexOf(i) > -1){
		DefaultSpecialEvent[i].fatalEvent[4].p[0].deathType = 2;
		DefaultSpecialEvent[i].fatalEvent[4].p[1].deathType = 2;
	}
}

DefaultSpecialEvent[1].fatalEvent[4].p = [{isKiller: true, deathType: 1},{isKiller: true, deathType: 1}];

DefaultSpecialEvent[2].fatalEvent[1].playerCount = 2;
DefaultSpecialEvent[2].fatalEvent[1].p = [{isKiller: false, deathType: 2},{isKiller: false, deathType: 0}];

DefaultSpecialEvent[10].fatalEvent[4].p = [{isKiller: true, deathType: 3},{isKiller: false, deathType: 1}];

export default SpecialArenaEvent;
export {DefaultSpecialEvent};