import csv
from collections import Counter

input_file = 'resources/4år_skills.csv'
output_file = 'keyword_counts.csv'

counter = Counter()

# Read and process input CSV
with open(input_file, 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    next(reader)  # Skip header
    for row in reader:
        if row and row[0].strip():
            keywords = [kw.strip().lower() for kw in row[0].split(',')]
            counter.update(keywords)

# Write sorted keyword counts to output CSV
with open(output_file, 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['keyword', 'count'])
    for keyword, count in counter.most_common():
        writer.writerow([keyword, count])
