export const tileSources = {
	0: "../assets/map/mountain-rock-1.png",
	1: "../assets/map/mountain-rock-2.png",
	2: "../assets/map/mountain-rock-3.png",
	3: "../assets/map/mountain-tree-1.png",
	4: "../assets/map/mountain-tree-2.png",
	5: "../assets/map/mountain-tree-3.png",
	6: "../assets/map/mountain-grass-1.png",
	7: "../assets/map/mountain-grass-2.png",
	8: "../assets/map/mountain-grass-3.png",
	9: "../assets/map/mountain-grass-4.png",
	10: "../assets/map/mountain-bush-1.png",
	11: "../assets/map/mountain-bush-2.png",
	12: "../assets/map/mountain-bush-3.png",
	13: "../assets/map/ocean-ice-1.png",
	14: "../assets/map/ocean-water-1.png",
	15: "../assets/map/mountain-flower-1.png",
	16: "../assets/map/forest-rock-1.png",
	17: "../assets/map/forest-rock-2.png",
	18: "../assets/map/forest-rock-3.png",
	19: "../assets/map/forest-tree-1.png",
	20: "../assets/map/forest-tree-2.png",
	21: "../assets/map/forest-tree-3.png",
	22: "../assets/map/forest-grass-1.png",
	23: "../assets/map/forest-grass-2.png",
	24: "../assets/map/forest-grass-3.png",
	25: "../assets/map/forest-grass-4.png",
	26: "../assets/map/forest-bush-1.png",
	27: "../assets/map/forest-mushroom-1.png",
	28: "../assets/map/forest-mushroom-2.png",
	29: "../assets/map/forest-sand-1.png",
	30: "../assets/map/ocean-water-2.png",
	31: "../assets/map/forest-flower-1.png",
	32: "../assets/map/desert-rock-1.png",
	33: "../assets/map/desert-rock-2.png",
	34: "../assets/map/desert-rock-3.png",
	35: "../assets/map/desert-tree-1.png",
	36: "../assets/map/desert-tree-2.png",
	37: "../assets/map/desert-tree-3.png",
	38: "../assets/map/desert-sand-1.png",
	39: "../assets/map/desert-flower-1.png",
	40: "../assets/map/desert-cactus-1.png",
	41: "../assets/map/desert-cactus-2.png",
	42: "../assets/map/desert-cactus-3.png",
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