function ArenaEvent(eventText, scope, playerCount, p){
	this.eventText = eventText;
	this.scope = scope;
	this.playerCount = playerCount;
	this.p = p;
	this.deaths = function(){return this.p.filter(function(player){return player.deathType > 0;}).length;};
	this.isSharedKill = false;
	this.isBloodbathEvent = function(){return this.scope % 2 === 1;};
	this.isDayEvent = function(){return (this.scope >> 1) % 2 === 1;};
	this.isNightEvent = function(){return (this.scope >> 2)% 2 === 1;};
	this.isFeastEvent = function(){return (this.scope >> 3)% 2 === 1;};
}

var DefaultEvent = [];
var DefaultText = [" grabs a shovel", " grabs a backpack and retreats", " finds a bow, some arrows, and a quiver", " runs into the cornucopia and hides",
" takes a handful of throwing knives", " finds a canteen full of water", " stays at the cornucopia for resources", " gathers as much food as (he/she1) can",
" grabs a sword", " takes a spear from inside the cornucopia", " finds a bag full of explosives", " clutches a first aid kit and runs away", " takes a sickle from inside the cornucopia",
" runs away with a lighter and some rope", " snatches a bottle of alcohol and a rag", " finds a backpack full of camping equipment", " grabs a backpack, not realizing it is empty",
" retrieves a trident from inside the cornucopia", " grabs a shield leaning on the cornucopia", " snatches a pair of sais", " grabs a jar of fishing bait while (Player2) gets fishing gear",
" scares (Player2) away from the cornucopia", " and (Player2) fight for a bag. (Player1) gives up and retreats", " and (Player2) fight for a bag. (Player2) gives up and retreats",
" breaks (Player2)'s nose for a basket of bread", " rips a mace out of (Player2)'s hands", ", (Player2), and (Player3) work together to get as many supplies as possible",
", (Player2), (Player3), and (Player4) share everything they gathered before running", " goes hunting", " injures (himself/herself1)", " explores the arena",
" fishes", " camouflauges (himself/herself1) in the bushes", " makes a wooden spear", " discovers a cave", " collects fruit from a tree", " searches for a water source",
" tries to sleep through the entire day", " makes a slingshot", " travels to higher ground", " discovers a river", " is pricked by thorns while picking berries",
" tries to spear fish with a trident", " searches for firewood", " constructs a shack", " practices (his/her1) archery", " picks flowers", " sees smoke rising in the distance, but decides not to investigate",
" scares (Player2) off", " diverts (Player2)'s attention and runs away", " stalks (Player2)", " steals from (Player2) while (he/she2) isn't looking", " attacks (Player2), but (he/she2) manages to escape",
" chases (Player2)", " runs away from (Player2)", " and (Player2) work together for the day", " and (Player2) split up to search for resources", " sprains (his/her1) ankle while running away from (Player2)",
", (Player2), (Player3), and (Player4) raid (Player5)'s camp while (he/she5) is hunting", " overhears (Player2) and (Player3) talking in the distance", " hunts for other tributes",
" and (Player2) hunt for other tributes", ", (Player2), and (Player3) hunt for other tributes", ", (Player2), (Player3), and (Player4) hunt for other tributes", ", (Player2), (Player3), (Player4), and (Player5) hunt for other tributes",
", (Player2), (Player3), (Player4), (Player5), and (Player6) hunt for other tributes", " receives a hatchet from an unknown sponsor", " receives clean water from an unknown sponsor",
" receives medical supplies from an unknown sponsor", " receives fresh food from an unknown sponsor", " receives an explosive from an unknown sponsor",
" thinks about home", " questions (his/her1) sanity", " defeats (Player2) in a fight, but spares (his/her2) life", " begs for (Player2) to kill (him/her1). (He/She2) refuses, keeping (Player1) alive",
" tends to (Player2)'s wounds", " starts a fire", " sets up camp for the night", " loses sight of where (he/she1) is", " climbs a tree to rest", " goes to sleep",
" tends to (his/her1) wounds", " sees a fire, but stays hidden", " screams for help", " stays awake all night", " passes out from exhaustion",
" cooks (his/her1) food before putting (his/her1) fire out", " cries (himself/herself1) to sleep", " tries to treat (his/her1) infection", " is awoken by nightmares",
" thinks about winning", " tries to sing (himself/herself1) to sleep", " attempts to start a fire, but is unsuccessful", " quietly hums", " is unable to start a fire and sleeps without warmth",
" looks at the night sky", ", (Player2), (Player3), (Player4), and (Player5) sleep in shifts", ", (Player2), (Player3), and (Player4) sleep in shifts", ", (Player2), and (Player3) sleep in shifts",
" and (Player2) sleep in shifts", " and (Player2) hold hands", " convinces (Player2) to snuggle with (him/her1)", " destroys (Player2)'s supplies while (he/she2) is asleep",
" lets (Player2) into (his/her1) shelter", " and (Player2) talk about the tributes still alive", " and (Player2) huddle for warmth", " and (Player2) tell stories about themselves to each other",
" and (Player2) run into each other and decide to truce for the night", ", (Player2), and (Player3) cheerfully sing songs together", ", (Player2), and (Player3) discuss the games and what might happen in the morning",
", (Player2), (Player3), and (Player4) tell each other ghost stories to lighten the mood", " fends (Player2), (Player3), and (Player4) away from (his/her1) fire", " gathers as much food into a bag as (he/she1) can before fleeing",
" sobs while gripping a photo of (his/her1) friends and family", " takes a staff leaning against the cornucopia", " stuffs a bundle of dry clothing into a backpack before sprinting away",
" and (Player2) decide to work together to get more supplies", " steals (Player2)'s memoirs", " destroys (Player2)'s memoirs out of spite",
" and (Player2) get into a fight over raw meat, but (Player2) gives up and runs away", " and (Player2) get into a fight over raw meat, but (Player1) gives up and runs away",
", (Player2), and (Player3) confront each other, but grab what they want slowly to avoid conflict", ", (Player2), (Player3), and (Player4) team up to grab food, supplies, weapons, and memoirs",
" bleeds out due to untreated injuries", " dies from an infection", ", (Player2), and (Player3) successfully ambush and kill (Player4), (Player5), and (Player6)",
", (Player2), and (Player3) unsuccessfully ambush (Player4), (Player5), and (Player6), who kill them instead", ", (Player2), (Player3), (Player4), and (Player5) track down and kill (Player6)",
", (Player2), (Player3), and (Player4) track down and kill (Player5)", ", (Player2), and (Player3) track down and kill (Player4)", " and (Player2) track down and kill (Player3)",
" tracks down and kills (Player2)", " ambushes (Player2) and kills (him/her2)", " throws a knife into (Player2)'s head", " catches (Player2) off guard and kills (him/her2)",
" strangles (Player2) after engaging in a fist fight", " shoots an arrow into (Player2)'s head", " bashes (Player2)'s head against a rock several times", " silently snaps (Player2)'s neck",
" decapitates (Player2) with a sword", " spears (Player2) in the abdomen", " sets (Player2) on fire with a molotov", " stabs (Player2) while (his/her2) back is turned",
" severely injures (Player2), but puts (him/her2) out of (his/her2) misery", " severely injures (Player2) and leaves (him/her2) to die", " bashes (Player2)'s head in with a mace",
" pushes (Player2) off a cliff during a knife fight", " throws a knife into (Player2)'s chest", " convinces (Player2) to not kill (him/her1), only to kill (him/her2) instead",
" kills (Player2) with (his/her2) own weapon", " overpowers (Player2), killing (him/her2)", " kills (Player2) as (he/she2) tries to run", " kills (Player2) with a hatchet", " severely slices (Player2) with a sword",
" strangles (Player2) with a rope", " kills (Player2) for (his/her2) supplies", " shoots a poisonous blow dart into (Player2)'s neck, slowly killing (him/her2)",
" stabs (Player2) with a tree branch", " stabs (Player2) in the back with a trident", " kills (Player2) with a sickle", " repeatedly stabs (Player2) to death with sais",
" is unable to convince (Player2) to not kill (him/her1)", " attacks (Player2), but (Player3) protects (him/her2), killing (Player1)", " shoots an arrow at (Player2), but misses and kills (Player3) instead",
", (Player2), and (Player3) start fighting, but (Player2) runs away as (Player1) kills (Player3)", " and (Player2) work together to drown (Player3)", ", (Player2), and (Player3) get into a fight. (Player1) triumphantly kills them both",
", (Player2), and (Player3) get into a fight. (Player2) triumphantly kills them both", ", (Player2), and (Player3) get into a fight. (Player3) triumphantly kills them both",
" sets an explosive off, killing (Player2)", " sets an explosive off, killing (Player2) and (Player3)", " sets an explosive off, killing (Player2), (Player3), and (Player4)",
" sets an explosive off, killing (Player2), (Player3), (Player4), and (Player5)", " sets an explosive off, killing (Player2), (Player3), (Player4), (Player5), and (Player6)",
" and (Player2) threaten a double suicide. It fails and they die", ", (Player2), (Player3), and (Player4) form a suicide pact, killing themselves", " and (Player2) fight (Player3) and (Player4). (Player1) and (Player2) survive",
" and (Player2) fight (Player3) and (Player4). (Player3) and (Player4) survive", " accidently steps on a landmine", " cannot handle the circumstances and commits suicide",
" falls into a pit and dies", " falls into a frozen lake and drowns", " steps off (his/her1) podium too soon and blows up", " finds (Player2) hiding in the cornucopia and kills (him/her2)",
" finds (Player2) hiding in the cornucopia, but (Player2) kills (him/her1)", " and (Player2) fight for a bag. (Player2) strangles (Player1) with the straps and runs",
" and (Player2) fight for a bag. (Player1) strangles (Player2) with the straps and runs", " begs for (Player2) to kill (him/her1). (He/She2) reluctantly obliges, killing (Player1)",
" poisons (Player2)'s drink, but mistakes it for (his/her1) own and dies", " poisons (Player2)'s drink. (He/She2) drinks it and dies", "'s trap kills (Player2)",
" kills (Player2) while (he/she2) is resting", " taints (Player2)'s food, killing (him/her2)", " unknowingly eats toxic berries", " dies from hypothermia", " dies from hunger",
" dies from thirst", " dies trying to escape the arena", " dies of dysentery", " attempts to climb a tree, but falls to (his/her1) death", " accidently detonates a land mine while trying to arm it",
" attempts to climb a tree, but falls on (Player2), killing them both", " forces (Player2) to kill (Player3) or (Player4). (He/She2) decides to kill (Player3)",
" forces (Player2) to kill (Player3) or (Player4). (He/She2) decides to kill (Player4)", " forces (Player2) to kill (Player3) or (Player4). (He/She2) refuses to kill, so (Player1) kills (him/her2) instead",
" forces (Player2) to kill (Player3) or (Player4). (He/She2) takes a third option and kills (Player1) instead"];

for (var i = 0; i < DefaultText.length; i++){
	DefaultEvent.push(new ArenaEvent("(Player1)" + DefaultText[i] + ".", 0, 1, [{isKiller: false, deathType: 0}]));
	
	//set scope
	if (i < 28 || (i > 132 && i < 187)){
		DefaultEvent[i].scope += 1;
	}
	if (i > 27 && i < 76){
		DefaultEvent[i].scope += 2;
	}
	if (i > 65 && i < 112){
		DefaultEvent[i].scope += 4;
	}
	if ((i > 123 && i < 181)||i > 186){
		DefaultEvent[i].scope += 6;
	}
	if (i > 111 && i < 182){
		DefaultEvent[i].scope += 8;
	}
	
	//set player count
	if (i < 20||(i > 27 && i < 48)||[60, 123, 124].indexOf(i)>-1||(i > 65 && i < 73)||(i > 75 && i < 96)||(i > 111 && i < 116)||(i > 177 && i < 182)){
		DefaultEvent[i].playerCount = 1;
	}
	else if([26, 59, 62, 98, 109, 121, 130, 170].indexOf(i)>-1||(i > 161 && i < 169)){
		DefaultEvent[i].playerCount = 3;
	}
	else if([27, 63, 97, 110, 111, 122, 129, 171, 175, 176, 177].indexOf(i)>-1||i > 201){
		DefaultEvent[i].playerCount = 4;
	}
	else if([58, 64, 96, 128, 172].indexOf(i)>-1){
		DefaultEvent[i].playerCount = 5;
	}
	else if([65, 125, 126, 127, 173].indexOf(i)>-1){
		DefaultEvent[i].playerCount = 6;
	}
	else DefaultEvent[i].playerCount = 2;
	
	//set defaults for kill status and death type
	if(DefaultEvent[i].playerCount>DefaultEvent[i].p.length){
		for (var j = 1; j < DefaultEvent[i].playerCount; j++){
			DefaultEvent[i].p.push({isKiller: false, deathType: 0});
		}
	}
	
	//set death type
	if (i === 123||i === 124||(i > 192 && i < 199)){
		DefaultEvent[i].p[0].deathType = 3;
	}
	else if([169, 183, 186, 203].indexOf(i)>-1||(i > 126 && i < 161)||(i > 162 && i < 166)||(i > 188 && i < 193)){
		DefaultEvent[i].p[DefaultEvent[i].playerCount - 1].deathType = 1;
	}
	else if((i > 177 && i < 182)||[188, 199, 200].indexOf(i)>-1){
		DefaultEvent[i].p[0].deathType = 2;
	}
	else if([161, 162, 184, 185, 187, 205].indexOf(i)>-1){
		DefaultEvent[i].p[0].deathType = 1;
	}
	else if(i === 125){
		for (j = 3; j < 6; j++){
			DefaultEvent[i].p[j].deathType = 1;
		}
	}
	else if(i === 126){
		for (j = 0; j < 3; j++){
			DefaultEvent[i].p[j].deathType = 1;
		}
	}
	else if(i === 166){
		DefaultEvent[i].p[1].deathType = 1;
		DefaultEvent[i].p[2].deathType = 1;
	}
	else if(i === 167){
		DefaultEvent[i].p[0].deathType = 1;
		DefaultEvent[i].p[2].deathType = 1;
	}
	else if(i === 168||i === 177){
		DefaultEvent[i].p[0].deathType = 1;
		DefaultEvent[i].p[1].deathType = 1;
	}
	else if (i > 169 && i < 174){
		for (j = 1; j < DefaultEvent[i].playerCount; j++){
			DefaultEvent[i].p[j].deathType = 1;
		}
	}
	else if (i === 174){
		DefaultEvent[i].p[0].deathType = 2;
		DefaultEvent[i].p[1].deathType = 2;
	}
	else if (i === 175){
		for (j = 0; j < 3; j++){
			DefaultEvent[i].p[j].deathType = 1;
		}
	}
	else if (i === 176){
		DefaultEvent[i].p[2].deathType = 1;
		DefaultEvent[i].p[3].deathType = 1;
	}
	else if (i === 201){
		DefaultEvent[i].p[0].deathType = 2;
		DefaultEvent[i].p[1].deathType = 1;
	}
	else if (i === 202){
		DefaultEvent[i].p[2].deathType = 1;
	}
	else if (i === 204){
		DefaultEvent[i].p[1].deathType = 1;
	}
	
	//set kill attribution
	if (i === 125){
		for (j = 0; j < 3; j++){
			DefaultEvent[i].p[j].isKiller = true;
		}	
	}
	else if (i === 126){
		for (j = 3; j < 6; j++){
			DefaultEvent[i].p[j].isKiller = true;
		}	
	}
	else if (i > 126 && i < 131){
		for (j = 0; j < DefaultEvent[i].playerCount - 2; j++){
			DefaultEvent[i].p[j].isKiller = true;
		}		
	}
	else if ([165, 173, 202, 203].indexOf(i)>-1){
		DefaultEvent[i].p[0].isKiller = true;
		DefaultEvent[i].p[1].isKiller = true;
	}
	else if (i === 162||i === 168){
		DefaultEvent[i].p[2].isKiller = true;
	}
	else if([167, 184, 185, 187, 205].indexOf(i)>-1){
		DefaultEvent[i].p[1].isKiller = true;
	}
	else if(i === 177){
		DefaultEvent[i].p[2].isKiller = true;
		DefaultEvent[i].p[3].isKiller = true;
	}
	else if(i > 125){
		DefaultEvent[i].p[0].isKiller = false;
	}
	else DefaultEvent[i].p[0].isKiller = true;
	
	 //set shared kill
	DefaultEvent[i].isSharedKill = (i > 124 && i < 131)||[165, 176, 177, 202, 203].indexOf(i)>-1;
}

export default ArenaEvent;
export {DefaultEvent};