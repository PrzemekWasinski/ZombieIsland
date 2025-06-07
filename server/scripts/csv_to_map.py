#A script to turn a csv file into a 2d array to use as a map

def format_csv_lines(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8') as outfile:
        for line in infile:
            line = line.strip()
            formatted_line = f'[{line}],\n'
            outfile.write(formatted_line)

input_file = 'test_map.csv'
output_file = 'map.csv'
format_csv_lines(input_file, output_file)
