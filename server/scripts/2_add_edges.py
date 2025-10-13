import csv
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
TL_EDGE = 7
TR_EDGE = 1
BL_EDGE = 5
BR_EDGE = 3

def read_csv(filename):
    with open(filename, 'r') as f:
        reader = csv.reader(f)
        return [[int(cell.strip()) for cell in row] for row in reader]

def write_csv(filename, data):
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data)

def is_land(value):
    return value != WATER

def get_land_type_from_neighbors(grid, row, col):
    height = len(grid)
    width = len(grid[0]) if height > 0 else 0
    
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            if dr == 0 and dc == 0:
                continue
            r, c = row + dr, col + dc
            if 0 <= r < height and 0 <= c < width:
                tile = grid[r][c]
        
                if tile in [SAND, PLAINS, FOREST, SNOW]:
                    return tile
        
                elif tile >= 100:
                    if 100 <= tile < 200:
                        return SAND
                    elif 200 <= tile < 300:
                        return PLAINS
                    elif 300 <= tile < 400:
                        return FOREST
                    elif 400 <= tile < 500:
                        return SNOW
    return None

def add_edges(grid):
    height = len(grid)
    width = len(grid[0]) if height > 0 else 0
    result = [row[:] for row in grid]
    
    for row in range(height - 1):
        for col in range(width - 1):
    
            tl = grid[row][col]
            tr = grid[row][col + 1]
            bl = grid[row + 1][col]
            br = grid[row + 1][col + 1]
            
    
    
    
            if tl == WATER and is_land(tr) and is_land(bl) and is_land(br):
        
                if result[row][col] == WATER:
                    land_type = get_land_type_from_neighbors(grid, row, col)
                    if land_type:
                        result[row][col] = TILE_BASES[land_type] + TL_EDGE
            
    
    
    
            if is_land(tl) and tr == WATER and is_land(bl) and is_land(br):
        
                if result[row][col + 1] == WATER:
                    land_type = get_land_type_from_neighbors(grid, row, col + 1)
                    if land_type:
                        result[row][col + 1] = TILE_BASES[land_type] + TR_EDGE
            
    
    
    
            if is_land(tl) and is_land(tr) and bl == WATER and is_land(br):
        
                if result[row + 1][col] == WATER:
                    land_type = get_land_type_from_neighbors(grid, row + 1, col)
                    if land_type:
                        result[row + 1][col] = TILE_BASES[land_type] + BL_EDGE
            
    
    
    
            if is_land(tl) and is_land(tr) and is_land(bl) and br == WATER:
        
                if result[row + 1][col + 1] == WATER:
                    land_type = get_land_type_from_neighbors(grid, row + 1, col + 1)
                    if land_type:
                        result[row + 1][col + 1] = TILE_BASES[land_type] + BR_EDGE
    
    return result

def main():
    input_file = "decorated_map.csv"
    output_file = "map.csv"
    
    print(f"Reading decorated map from {input_file}...")
    
    try:
        grid = read_csv(input_file)
    except FileNotFoundError:
        print(f"Error: {input_file} not found!")
        print("Make sure you've run decorate_map.py first!")
        return
    
    print(f"Adding edge tiles to {len(grid)}x{len(grid[0]) if grid else 0} map...")
    
    final_grid = add_edges(grid)
    
    write_csv(output_file, final_grid)
    
    print(f"Processing complete! Final map written to {output_file}")

if __name__ == "__main__":
    main()