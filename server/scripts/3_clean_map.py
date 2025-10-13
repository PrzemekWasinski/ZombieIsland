import csv
WATER = 0
SAND = 1
PLAINS = 2
FOREST = 3
SNOW = 4

def read_csv(filename):
    with open(filename, 'r') as f:
        reader = csv.reader(f)
        return [[int(cell.strip()) for cell in row] for row in reader]

def write_csv(filename, data):
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data)

def is_edge_tile(value):
    if value >= 100:
        last_two_digits = value % 100
        return last_two_digits in [1, 3, 5, 7]
    return False

def has_solid_block_neighbor(grid, row, col):
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
                    return True
    return False

def cleanup_edges(grid):
    height = len(grid)
    width = len(grid[0]) if height > 0 else 0
    result = [row[:] for row in grid]
    
    edges_removed = 0
    
    for row in range(height):
        for col in range(width):
            tile = grid[row][col]
            
    
            if is_edge_tile(tile):
        
                if not has_solid_block_neighbor(grid, row, col):
                    result[row][col] = WATER
                    edges_removed += 1
    
    return result, edges_removed

def main():
    input_file = "map.csv"
    output_file = "map_cleaned.csv"
    
    print(f"Reading map from {input_file}...")
    
    try:
        grid = read_csv(input_file)
    except FileNotFoundError:
        print(f"Error: {input_file} not found!")
        return
    
    print(f"Cleaning up edges in {len(grid)}x{len(grid[0]) if grid else 0} map...")
    
    cleaned_grid, edges_removed = cleanup_edges(grid)
    
    write_csv(output_file, cleaned_grid)
    
    print(f"Removed {edges_removed} invalid edge tiles")
    print(f"Processing complete! Cleaned map written to {output_file}")

if __name__ == "__main__":
    main()