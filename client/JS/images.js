export const tileSources = {
	//Main tile images
	0: "../assets/map/water.png",
	1: "../assets/map/Sand/center.png",
	2: "../assets/map/Plains/center.png",
	3: "../assets/map/Forest/center.png",
	4: "../assets/map/Snow/center.png",

	99: "../assets/map/Forest/center.png",
	98: "../assets/map/Forest/center.png",

	//Tile edges and corners
	100: "../assets/map/Sand/t-flat.png",
	101: "../assets/map/Sand/tr-edge.png",
	102: "../assets/map/Sand/r-flat.png",
	103: "../assets/map/Sand/br-edge.png",
	104: "../assets/map/Sand/b-flat.png",
	105: "../assets/map/Sand/bl-edge.png",
	106: "../assets/map/Sand/l-flat.png",
	107: "../assets/map/Sand/tl-edge.png",
	108: "../assets/map/Sand/tr-corner.png",
	109: "../assets/map/Sand/br-corner.png",
	110: "../assets/map/Sand/bl-corner.png",
	111: "../assets/map/Sand/tl-corner.png",

	200: "../assets/map/Plains/t-flat.png",
	201: "../assets/map/Plains/tr-edge.png",
	202: "../assets/map/Plains/r-flat.png",
	203: "../assets/map/Plains/br-edge.png",
	204: "../assets/map/Plains/b-flat.png",
	205: "../assets/map/Plains/bl-edge.png",
	206: "../assets/map/Plains/l-flat.png",
	207: "../assets/map/Plains/tl-edge.png",
	208: "../assets/map/Plains/tr-corner.png",
	209: "../assets/map/Plains/br-corner.png",
	210: "../assets/map/Plains/bl-corner.png",
	211: "../assets/map/Plains/tl-corner.png",

	300: "../assets/map/Forest/t-flat.png",
	301: "../assets/map/Forest/tr-edge.png",
	302: "../assets/map/Forest/r-flat.png",
	303: "../assets/map/Forest/br-edge.png",
	304: "../assets/map/Forest/b-flat.png",
	305: "../assets/map/Forest/bl-edge.png",
	306: "../assets/map/Forest/l-flat.png",
	307: "../assets/map/Forest/tl-edge.png",
	308: "../assets/map/Forest/tr-corner.png",
	309: "../assets/map/Forest/br-corner.png",
	310: "../assets/map/Forest/bl-corner.png",
	311: "../assets/map/Forest/tl-corner.png",

	400: "../assets/map/Snow/t-flat.png",
	401: "../assets/map/Snow/tr-edge.png",
	402: "../assets/map/Snow/r-flat.png",
	403: "../assets/map/Snow/br-edge.png",
	404: "../assets/map/Snow/b-flat.png",
	405: "../assets/map/Snow/bl-edge.png",
	406: "../assets/map/Snow/l-flat.png",
	407: "../assets/map/Snow/tl-edge.png",
	408: "../assets/map/Snow/tr-corner.png",
	409: "../assets/map/Snow/br-corner.png",
	410: "../assets/map/Snow/bl-corner.png",
	411: "../assets/map/Snow/tl-corner.png",
};

export const sprites = {
	//EnemyName-Action: [path, imageSize, frameAmount]

	//Ghosts
	"Ghost-attack": ["../assets/enemies/ghosts/ghost/attack.png", 64, 12],
	"Ghost-death": ["../assets/enemies/ghosts/ghost/death.png", 64, 9],
	"Ghost-hurt": ["../assets/enemies/ghosts/ghost/hurt.png", 64, 4],
	"Ghost-walk": ["../assets/enemies/ghosts/ghost/walk.png", 64, 6],

	"Shadow Ghost-attack": ["../assets/enemies/ghosts/shadow-ghost/attack.png", 64, 12],
	"Shadow Ghost-death": ["../assets/enemies/ghosts/shadow-ghost/death.png", 64, 9],
	"Shadow Ghost-hurt": ["../assets/enemies/ghosts/shadow-ghost/hurt.png", 64, 4],
	"Shadow Ghost-walk": ["../assets/enemies/ghosts/shadow-ghost/walk.png", 64, 6],

	"Night Ghost-attack": ["../assets/enemies/ghosts/night-ghost/attack.png", 64, 12],
	"Night Ghost-death": ["../assets/enemies/ghosts/night-ghost/death.png", 64, 9],
	"Night Ghost-hurt": ["../assets/enemies/ghosts/night-ghost/hurt.png", 64, 4],
	"Night Ghost-walk": ["../assets/enemies/ghosts/night-ghost/walk.png", 64, 6],

	//Goblins
	"Goblin-attack": ["../assets/enemies/goblins/goblin/attack.png", 64, 5],
	"Goblin-death": ["../assets/enemies/goblins/goblin/death.png", 64, 6],
	"Goblin-hurt": ["../assets/enemies/goblins/goblin/hurt.png", 64, 4],
	"Goblin-walk": ["../assets/enemies/goblins/goblin/walk.png", 64, 6],

	"Sand Goblin-attack": ["../assets/enemies/goblins/sand-goblin/attack.png", 64, 5],
	"Sand Goblin-death": ["../assets/enemies/goblins/sand-goblin/death.png", 64, 6],
	"Sand Goblin-hurt": ["../assets/enemies/goblins/sand-goblin/hurt.png", 64, 4],
	"Sand Goblin-walk": ["../assets/enemies/goblins/sand-goblin/walk.png", 64, 6],

	"Snow Goblin-attack": ["../assets/enemies/goblins/snow-goblin/attack.png", 64, 5],
	"Snow Goblin-death": ["../assets/enemies/goblins/snow-goblin/death.png", 64, 6],
	"Snow Goblin-hurt": ["../assets/enemies/goblins/snow-goblin/hurt.png", 64, 4],
	"Snow Goblin-walk": ["../assets/enemies/goblins/snow-goblin/walk.png", 64, 6],

	//Golems
	"Sand Golem-attack": ["../assets/enemies/golems/sand-golem/attack.png", 128, 9],
	"Sand Golem-death": ["../assets/enemies/golems/sand-golem/death.png", 128, 8],
	"Sand Golem-hurt": ["../assets/enemies/golems/sand-golem/hurt.png", 128, 4],
	"Sand Golem-walk": ["../assets/enemies/golems/sand-golem/walk.png", 128, 8],

	"Snow Golem-attack": ["../assets/enemies/golems/snow-golem/attack.png", 128, 9],
	"Snow Golem-death": ["../assets/enemies/golems/snow-golem/death.png", 128, 8],
	"Snow Golem-hurt": ["../assets/enemies/golems/snow-golem/hurt.png", 128, 4],
	"Snow Golem-walk": ["../assets/enemies/golems/snow-golem/walk.png", 128, 8],

	"Night Golem-attack": ["../assets/enemies/golems/night-golem/attack.png", 128, 9],
	"Night Golem-death": ["../assets/enemies/golems/night-golem/death.png", 128, 8],
	"Night Golem-hurt": ["../assets/enemies/golems/night-golem/hurt.png", 128, 4],
	"Night Golem-walk": ["../assets/enemies/golems/night-golem/walk.png", 128, 8],

	//Orcs
	"Orc-attack": ["../assets/enemies/orcs/orc/attack.png", 64, 8],
	"Orc-death": ["../assets/enemies/orcs/orc/death.png", 64, 8],
	"Orc-hurt": ["../assets/enemies/orcs/orc/hurt.png", 64, 6],
	"Orc-walk": ["../assets/enemies/orcs/orc/walk.png", 64, 6],

	"Blue Orc-attack": ["../assets/enemies/orcs/blue-orc/attack.png", 64, 8],
	"Blue Orc-death": ["../assets/enemies/orcs/blue-orc/death.png", 64, 8],
	"Blue Orc-hurt": ["../assets/enemies/orcs/blue-orc/hurt.png", 64, 6],
	"Blue Orc-walk": ["../assets/enemies/orcs/blue-orc/walk.png", 64, 6],

	"Orc Worrior-attack": ["../assets/enemies/orcs/orc-worrior/attack.png", 64, 8],
	"Orc Worrior-death": ["../assets/enemies/orcs/orc-worrior/death.png", 64, 8],
	"Orc Worrior-hurt": ["../assets/enemies/orcs/orc-worrior/hurt.png", 64, 6],
	"Orc Worrior-walk": ["../assets/enemies/orcs/orc-worrior/walk.png", 64, 6],

	//Skeletons
	"Skeleton-attack": ["../assets/enemies/skeletons/skeleton/attack.png", 64, 9],
	"Skeleton-death": ["../assets/enemies/skeletons/skeleton/death.png", 64, 6],
	"Skeleton-hurt": ["../assets/enemies/skeletons/skeleton/hurt.png", 64, 4],
	"Skeleton-walk": ["../assets/enemies/skeletons/skeleton/walk.png", 64, 6],

	"Golden Skeleton-attack": ["../assets/enemies/skeletons/golden-skeleton/attack.png", 64, 9],
	"Golden Skeleton-death": ["../assets/enemies/skeletons/golden-skeleton/death.png", 64, 6],
	"Golden Skeleton-hurt": ["../assets/enemies/skeletons/golden-skeleton/hurt.png", 64, 4],
	"Golden Skeleton-walk": ["../assets/enemies/skeletons/golden-skeleton/walk.png", 64, 6],

	"Skeleton Worrior-attack": ["../assets/enemies/skeletons/skeleton-worrior/attack.png", 64, 9],
	"Skeleton Worrior-death": ["../assets/enemies/skeletons/skeleton-worrior/death.png", 64, 6],
	"Skeleton Worrior-hurt": ["../assets/enemies/skeletons/skeleton-worrior/hurt.png", 64, 4],
	"Skeleton Worrior-walk": ["../assets/enemies/skeletons/skeleton-worrior/walk.png", 64, 6],

	//Slimes
	"Crystal Slime-attack": ["../assets/enemies/slimes/crystal-slime/attack.png", 64, 9],
	"Crystal Slime-death": ["../assets/enemies/slimes/crystal-slime/death.png", 64, 10],
	"Crystal Slime-hurt": ["../assets/enemies/slimes/crystal-slime/hurt.png", 64, 5],
	"Crystal Slime-walk": ["../assets/enemies/slimes/crystal-slime/walk.png", 64, 8],

	"Electric Slime-attack": ["../assets/enemies/slimes/electric-slime/attack.png", 64, 9],
	"Electric Slime-death": ["../assets/enemies/slimes/electric-slime/death.png", 64, 10],
	"Electric Slime-hurt": ["../assets/enemies/slimes/electric-slime/hurt.png", 64, 5],
	"Electric Slime-walk": ["../assets/enemies/slimes/electric-slime/walk.png", 64, 8],

	"Fire Slime-attack": ["../assets/enemies/slimes/fire-slime/attack.png", 64, 9],
	"Fire Slime-death": ["../assets/enemies/slimes/fire-slime/death.png", 64, 10],
	"Fire Slime-hurt": ["../assets/enemies/slimes/fire-slime/hurt.png", 64, 5],
	"Fire Slime-walk": ["../assets/enemies/slimes/fire-slime/walk.png", 64, 8],

	"Ghost Slime-attack": ["../assets/enemies/slimes/ghost-slime/attack.png", 64, 9],
	"Ghost Slime-death": ["../assets/enemies/slimes/ghost-slime/death.png", 64, 10],
	"Ghost Slime-hurt": ["../assets/enemies/slimes/ghost-slime/hurt.png", 64, 5],
	"Ghost Slime-walk": ["../assets/enemies/slimes/ghost-slime/walk.png", 64, 8],

	"Green Slime-attack": ["../assets/enemies/slimes/green-slime/attack.png", 64, 9],
	"Green Slime-death": ["../assets/enemies/slimes/green-slime/death.png", 64, 10],
	"Green Slime-hurt": ["../assets/enemies/slimes/green-slime/hurt.png", 64, 5],
	"Green Slime-walk": ["../assets/enemies/slimes/green-slime/walk.png", 64, 8],

	"Hell Slime-attack": ["../assets/enemies/slimes/hell-slime/attack.png", 64, 9],
	"Hell Slime-death": ["../assets/enemies/slimes/hell-slime/death.png", 64, 10],
	"Hell Slime-hurt": ["../assets/enemies/slimes/hell-slime/hurt.png", 64, 5],
	"Hell Slime-walk": ["../assets/enemies/slimes/hell-slime/walk.png", 64, 8],

	"Ice Slime-attack": ["../assets/enemies/slimes/ice-slime/attack.png", 64, 9],
	"Ice Slime-death": ["../assets/enemies/slimes/ice-slime/death.png", 64, 10],
	"Ice Slime-hurt": ["../assets/enemies/slimes/ice-slime/hurt.png", 64, 5],
	"Ice Slime-walk": ["../assets/enemies/slimes/ice-slime/walk.png", 64, 8],

	"Lava Slime-attack": ["../assets/enemies/slimes/lava-slime/attack.png", 64, 9],
	"Lava Slime-death": ["../assets/enemies/slimes/lava-slime/death.png", 64, 10],
	"Lava Slime-hurt": ["../assets/enemies/slimes/lava-slime/hurt.png", 64, 5],
	"Lava Slime-walk": ["../assets/enemies/slimes/lava-slime/walk.png", 64, 8],

	//Zombies
	"Zombie-attack": ["../assets/enemies/zombies/zombie/attack.png", 64, 10],
	"Zombie-death": ["../assets/enemies/zombies/zombie/death.png", 64, 9],
	"Zombie-hurt": ["../assets/enemies/zombies/zombie/hurt.png", 64, 4],
	"Zombie-walk": ["../assets/enemies/zombies/zombie/walk.png", 64, 6],

	"Night Zombie-attack": ["../assets/enemies/zombies/night-zombie/attack.png", 64, 10],
	"Night Zombie-death": ["../assets/enemies/zombies/night-zombie/death.png", 64, 9],
	"Night Zombie-hurt": ["../assets/enemies/zombies/night-zombie/hurt.png", 64, 4],
	"Night Zombie-walk": ["../assets/enemies/zombies/night-zombie/walk.png", 64, 6],

	"Viking Zombie-attack": ["../assets/enemies/zombies/viking-zombie/attack.png", 64, 10],
	"Viking Zombie-death": ["../assets/enemies/zombies/viking-zombie/death.png", 64, 9],
	"Viking Zombie-hurt": ["../assets/enemies/zombies/viking-zombie/hurt.png", 64, 4],
	"Viking Zombie-walk": ["../assets/enemies/zombies/viking-zombie/walk.png", 64, 6],
};

export const objectImages = {
	//Bushes
	"Blue Berry Bush": "../assets/objects/bushes/blue_berry_bush.png",
	"Red Berry Bush": "../assets/objects/bushes/red_berry_bush.png",
	"Yellow Berry Bush": "../assets/objects/bushes/yellow_berry_bush.png",
	"Cactus": "../assets/objects/bushes/cactus.png",
	"Fruit Cactus": "../assets/objects/bushes/fruit_cactus.png",
	"Snow Bush": "../assets/objects/bushes/snow_bush.png",

	//Mushrooms
	"Vine Mushroom": "../assets/objects/mushroom/vine_mushroom.png",
	"White Mushroom": "../assets/objects/mushroom/white_mushroom.png",
	"Red Mushroom": "../assets/objects/mushroom/red_mushroom.png",
	"Ice Mushroom": "../assets/objects/mushroom/ice_mushroom.png",

	"Ice Flower": "../assets/objects/plants/ice_flower.png",

	"Ice Spike":   "../assets/objects/rocks/ice_spike.png",
	"White Rock":  "../assets/objects/rocks/white_rock.png",
	"Light Stone": "../assets/objects/rocks/light_stone.png",
	"Brown Rock":  "../assets/objects/rocks/brown_rock.png",
	"Grey Rock":   "../assets/objects/rocks/grey_rock.png",

	"Desert Spikes": "../assets/objects/sand/desert_spikes.png",
	"Desert Rock": "../assets/objects/sand/desert_rock.png",
	"Sand Deposit": "../assets/objects/sand/sand_deposit.png",

	"Fruit Tree": "../assets/objects/trees/fruit_tree.png",
	"Oak Tree": "../assets/objects/trees/oak_tree.png",
	"Ice Tree": "../assets/objects/trees/ice_tree.png",
	"Christmas Tree": "../assets/objects/trees/christmas_tree.png",
	"Snowy Tree": "../assets/objects/trees/snowy_tree.png",
	"Palm Tree": "../assets/objects/trees/palm_tree.png",
	"Green Palm Tree": "../assets/objects/trees/green_palm_tree.png",

	"Sell Chest": "../assets/objects/Interactable/sell-chest.png",
	"Upgrades Chest": "../assets/objects/Interactable/upgrade-chest.png",
	"Potions Chest": "../assets/objects/Interactable/potion-chest.png"
}

export const playerImages = {
	"attack": ["../assets/player_sprite/lv1/attack.png", 8],
	"death": ["../assets/player_sprite/lv1/death.png", 7],
	"hurt": ["../assets/player_sprite/lv1/hurt.png", 5],
	"idle": ["../assets/player_sprite/lv1/idle.png", 12],
	"walk_attack": ["../assets/player_sprite/lv1/walk_attack.png", 6],
	"walk": ["../assets/player_sprite/lv1/walk.png", 6]
};

export const boatSprite = {
	path: "../assets/player_sprite/boat/boat-sprite.png",
	frameSize: 64,
	frameCount: 5
};

export const itemImages = {
	//Object/enemy drops
	"Apple": "../assets/items/apple.png",
	"Blue Berry": "../assets/items/blue-berry.png",
	"Cactus Fruit": "../assets/items/cactus-fruit.png",
	"Coconut": "../assets/items/coconut.png",
	"Diamond": "../assets/items/diamond.png",
	"Gem": "../assets/items/gem.png",
	"Ice Berry": "../assets/items/ice-berry.png",
	"Ice Flower": "../assets/items/ice-flower.png",
	"Ice Mushroom": "../assets/items/ice-mushroom.png",
	"Red Berry": "../assets/items/red-berry.png",
	"Red Mushroom": "../assets/items/red-mushroom.png",
	"Ruby": "../assets/items/ruby.png",
	"Stone": "../assets/items/stone.png",
	"White Mushroom": "../assets/items/white-mushroom.png",
	"Wood": "../assets/items/wood.png",
	"Yellow Berry": "../assets/items/yellow-berry.png",

	//Enemy bonus drops
	"Gold": "../assets/items/Gold.png",
	"Heart": "../assets/items/heart.png",

	//Upgrades shop
	"Sword Upgrade": "../assets/items/shop/sword-upgrade.png",
	"Health Upgrade": "../assets/items/shop/health-upgrade.png",
	"Speed Upgrade": "../assets/items/shop/speed-upgrade.png",

	//Potion shop
	"Small Health Potion": "../assets/items/small-healing-potion.png",
	"Medium Health Potion": "../assets/items/medium-healing-potion.png",
	"Large Health Potion": "../assets/items/large-healing-potion.png"
}

export const tileImages = {};

export function loadImages(callback) {
	let totalImages = Object.keys(tileSources).length + Object.keys(sprites).length + 1; // +1 for boat sprite
	let imagesLoaded = 0;

	const checkDone = () => {
		imagesLoaded++;
		if (imagesLoaded === totalImages) {
			callback();
		}
	};

	for (let key in tileSources) {
		const img = new Image();
		img.src = tileSources[key];

		img.onload = checkDone;
		img.onerror = () => console.error(`Failed to load image: ${tileSources[key]}`);

		tileImages[key] = img;
	}

	for (let sprite in sprites) {
		const spriteImg = new Image();
		spriteImg.src = sprites[sprite][0];

		spriteImg.onload = checkDone;
		spriteImg.onerror = () => console.error(`Failed to load image: ${sprites[sprite][0]}`);

		sprites[sprite][0] = spriteImg;
	}

	for (let key in objectImages) {
		const objectImg = new Image();
		objectImg.src = objectImages[key];

		objectImg.onload = checkDone;
		objectImg.onerror = () => console.error(`Failed to load image: ${objectImages[key]}`);

		objectImages[key] = objectImg;
	}

	for (let key in playerImages) {
		const playerImg = new Image();
		playerImg.src = playerImages[key][0];

		playerImg.onload = checkDone;
		playerImg.onerror = () => console.error(`Failed to load image: ${playerImages[key][0]}`);

		playerImages[key][0] = playerImg;
	}

	for (let key in itemImages) {
		const itemImg = new Image();
		itemImg.src = itemImages[key];

		itemImg.onload = checkDone;
		itemImg.onerror = () => console.error(`Failed to load image: ${itemImages[key]}`);

		itemImages[key] = itemImg;
	}

	// Load boat sprite
	const boatImg = new Image();
	boatImg.src = boatSprite.path;

	boatImg.onload = checkDone;
	boatImg.onerror = () => console.error(`Failed to load image: ${boatSprite.path}`);

	boatSprite.image = boatImg;
}