export const tileSources = {
	0: "../assets/map/forest/rock1.png",
	1: "../assets/map/forest/tree12.png",
	2: "../assets/map/forest/tree11.png",
	3: "../assets/map/forest/tree10.png",
	4: "../assets/map/forest/tree9.png",
	5: "../assets/map/forest/tree8.png",
	6: "../assets/map/forest/tree7.png",
	7: "../assets/map/forest/tree6.png",
	8: "../assets/map/forest/tree5.png",
	9: "../assets/map/desert/tree4.png",
	10: "../assets/map/desert/tree3.png",
	11: "../assets/map/desert/tree2.png",
	12: "../assets/map/desert/tree1.png",
	13: "../assets/map/mountains/tree3.png",
	14: "../assets/map/mountains/tree2.png",
	15: "../assets/map/mountains/tree1.png",
	16: "../assets/map/forest/tree3.png",
	17: "../assets/map/forest/tree2.png",
	18: "../assets/map/forest/bush3.png",
	19: "../assets/map/forest/bush4.png",
	20: "../assets/map/forest/bush5.png",
	21: "../assets/map/forest/bush9.png",
	22: "../assets/map/forest/bush10.png",
	23: "../assets/map/forest/bush6.png",
	24: "../assets/map/desert/cactus1.png",
	25: "../assets/map/desert/cactus2.png",
	26: "../assets/map/desert/cactus3.png",
	27: "../assets/map/forest/bush7.png",
	28: "../assets/map/forest/bush8.png",
	29: "../assets/map/mountains/bush1.png",
	30: "../assets/map/mountains/bush2.png",
	31: "../assets/map/ocean/water.png",
	32: "../assets/map/forest/grass.png",
	33: "../assets/map/mountains/snow.png",
	34: "../assets/map/desert/sand.png",
	35: "../assets/map/forest/bush2.png",
	36: "../assets/map/forest/bush1.png",
	37: "../assets/map/ocean/rock3.png",
	38: "../assets/map/mountains/rock2.png",
	39: "../assets/map/mountains/rock1.png",
	40: "../assets/map/ocean/rock2.png",
	41: "../assets/map/ocean/rock1.png",
	42: "../assets/map/forest/rock9.png",
	43: "../assets/map/forest/rock8.png",
	44: "../assets/map/forest/rock7.png",
	45: "../assets/map/forest/rock6.png",
	46: "../assets/map/forest/rock5.png",
	47: "../assets/map/forest/rock4.png",
	48: "../assets/map/forest/rock3.png",
	49: "../assets/map/forest/rock2.png",
};

export const sprites = [
	"../assets/enemies/slime/green_slime.png",
	"../assets/enemies/slime/toxic_slime.png",
	"../assets/enemies/slime/magma_slime.png"
]

export const tileImages = {};

export function loadImages(callback) {
	let totalImages = Object.keys(tileSources).length + sprites.length;
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

	for (let i = 0; i < sprites.length; i++) {
		const img = new Image();
		img.src = sprites[i];

		img.onload = checkDone;
		img.onerror = () => console.error(`Failed to load image: ${sprites[i]}`);

		sprites[i] = img;
	}
}