#Simple script to turn csv file contents into a JS 2D array

input_file = 'map.csv'
output_file = 'final.csv'

with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
    for line in infile:
        line = line.strip() 
        new_line = f'[{line}],\n'
        outfile.write(new_line)