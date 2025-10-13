import csv
import sys


WATER = 0
SAND = 1
PLAINS = 2
FOREST = 3
SNOW = 4


TILE_BASES = {
    SAND: 100,
    PLAINS: 200,
    FOREST: 300,
    SNOW: 400
}


T_FLAT = 0
TR_EDGE = 1
R_FLAT = 2
BR_EDGE = 3
B_FLAT = 4
BL_EDGE = 5
L_FLAT = 6
TL_EDGE = 7
TR_CORNER = 8
BR_CORNER = 9
BL_CORNER = 10
TL_CORNER = 11
CENTER = 12

def read_csv(filename):
    with open(filename, 'r') as f:
        reader = csv.reader(f)
        return [[int(cell.strip()) for cell in row] for row in reader]

def write_csv(filename, data):
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data)

def get_base_land_type(value):
    if value in [SAND, PLAINS, FOREST, SNOW]:
        return value
    
    
    
    
    
    
    
    
    else:
        return WATER

def get_surrounding_tiles(grid, row, col):
    height = len(grid)
    width = len(grid[0]) if height > 0 else 0

    neighbors = {}
    positions = {
        'tl': (-1, -1), 't': (-1, 0), 'tr': (-1, 1),
        'l': (0, -1), 'c': (0, 0), 'r': (0, 1),
        'bl': (1, -1), 'b': (1, 0), 'br': (1, 1)
    }

    for key, (dr, dc) in positions.items():
        r, c = row + dr, col + dc
        if 0 <= r < height and 0 <= c < width:
            neighbors[key] = get_base_land_type(grid[r][c])
        else:
            neighbors[key] = WATER  

    return neighbors

def get_land_type(neighbors):
    for key in ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']:
        if key in neighbors and neighbors[key] in [SAND, PLAINS, FOREST, SNOW]:
            return neighbors[key]
    return None



def determine_transition_tile(neighbors, land_type):
    if land_type is None:
        return WATER

    base = TILE_BASES[land_type]

    
    t_land = neighbors.get('t', WATER) == land_type
    r_land = neighbors.get('r', WATER) == land_type
    b_land = neighbors.get('b', WATER) == land_type
    l_land = neighbors.get('l', WATER) == land_type

    
    tl_land = neighbors.get('tl', WATER) == land_type
    tr_land = neighbors.get('tr', WATER) == land_type
    bl_land = neighbors.get('bl', WATER) == land_type
    br_land = neighbors.get('br', WATER) == land_type

    cardinal_count = sum([t_land, r_land, b_land, l_land])

    if t_land and r_land and b_land and l_land and not tl_land:
        return base + BR_CORNER  
    if t_land and r_land and b_land and l_land and not tr_land:
        return base + BL_CORNER  
    if t_land and r_land and b_land and l_land and not bl_land:
        return base + TR_CORNER  
    if t_land and r_land and b_land and l_land and not br_land:
        return base + TL_CORNER  

    if b_land and r_land and br_land and not t_land and not l_land:
        return base + BR_CORNER  
    if b_land and l_land and bl_land and not t_land and not r_land:
        return base + BL_CORNER  
    if t_land and r_land and tr_land and not b_land and not l_land:
        return base + TR_CORNER  
    if t_land and l_land and tl_land and not b_land and not r_land:
        return base + TL_CORNER  

    
    if cardinal_count == 1:
        if b_land:
            return base + T_FLAT
        if l_land:
            return base + R_FLAT
        if t_land:
            return base + B_FLAT
        if r_land:
            return base + L_FLAT

    return WATER


def process_map(grid):
    """Process the map and add transition tiles."""
    height = len(grid)
    width = len(grid[0]) if height > 0 else 0
    result = [row[:] for row in grid]  
    
    for row in range(height):
        for col in range(width):
            if grid[row][col] == WATER:
                neighbors = get_surrounding_tiles(grid, row, col)
                land_type = get_land_type(neighbors)
                if land_type is not None:
                    result[row][col] = determine_transition_tile(neighbors, land_type)
    
    return result

def main():
    
    input_file = "input.csv"
    output_file = "decorated_map.csv"
    
    print(f"Reading map from {input_file}...")
    
    
    try:
        grid = read_csv(input_file)
    except FileNotFoundError:
        print(f"Error: {input_file} not found!")
        sys.exit(1)
    
    print(f"Processing {len(grid)}x{len(grid[0]) if grid else 0} map...")
    
    
    processed_grid = process_map(grid)
    
    
    write_csv(output_file, processed_grid)
    
    print(f"Processing complete! Output written to {output_file}")

if __name__ == "__main__":
    main()