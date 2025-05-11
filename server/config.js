import { map } from "./map.js"

const config = {
    MOVE_SPEED: 3,
    TILE_SIZE: 61,
    CANVAS_WIDTH: 1891,
    CANVAS_HEIGHT: 1037,
    VISIBLE_TILES_X: Math.ceil(1891 / 61),
    VISIBLE_TILES_Y: Math.ceil(1037 / 61),
    PASSABLE_TILES: [6, 7, 8, 9, 13, 15, 22, 23, 24, 25, 27, 28, 29, 31, 38, 40],
    MAP: map
}

export default config