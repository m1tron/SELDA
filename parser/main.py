import json
import re
import os
import time


print("hello")

def parse_json(file_name):
    """ Some initial testing on MacBook Air m1 show runtimes of around 1min 30sec on a 3.5GB json"""
    start = time.time()
    output_name = modify_filename(file_name, "_escaped")
    with open(file_name, "r", encoding="utf-8") as infile, \
            open(output_name, "w", encoding="utf-8") as outfile:
        for idx, line in enumerate(infile):
            obj = json.loads(line)  # JSON to Python object

            # Clean from \t \n \r
            obj_cleaned = clean_json_strings(obj)

            # Convert back and write
            outfile.write(json.dumps(obj_cleaned, ensure_ascii=False) + "\n")

    end = time.time()
    print(f"Operation took {end-start:.1f}seconds. Fixed JSON saved as:", output_name)


def clean_json_strings(data):
    """
    Recursively replace newline, tab, and carriage return characters in all string fields.
    """
    if isinstance(data, str):
        # Replace any sequence of \t, \n, or \r with a single space.
        return re.sub(r"[\"\\\t\n\r\f\v\b]+", " ", data)  # Includes \f (form feed), \v (vertical tab), and \0 (null)
    elif isinstance(data, list):
        return [clean_json_strings(item) for item in data]
    elif isinstance(data, dict):
        return {key: clean_json_strings(value) for key, value in data.items()}
    else:
        return data


def modify_filename(name: str, suffix: str) -> str:
    split = name.rsplit(".",1)
    return split[0] + suffix + "." + split[1]


def split_json(file_name, stop_idx, start_idx=0):
    output_name = modify_filename(file_name, f"_{start_idx}-{stop_idx}")
    with open(file_name, "r", encoding="utf-8") as infile, open(output_name, "w", encoding="utf-8") as outfile:
        for idx, line in enumerate(infile):
            if idx < start_idx:
                continue
            if idx >= stop_idx:
                break
            outfile.write(line)

    print("Cut JSON saved as: ", output_name)


def parse_and_cut(file_name, stop_idx, start_idx=0):
    output_name = modify_filename(file_name, f"_{start_idx}-{stop_idx}")
    with open(file_name, "r", encoding="utf-8") as infile, open(output_name, "w", encoding="utf-8") as outfile:
        for idx, line in enumerate(infile):
            if idx < start_idx:
                continue
            if idx >= stop_idx:
                break

            obj = json.loads(line)  # JSON to Python object

            # Clean from \t \n \r
            obj_cleaned = clean_json_strings(obj)

            # Convert back and write
            outfile.write(json.dumps(obj_cleaned, ensure_ascii=False) + "\n")

    print("Cut JSON saved as: ", output_name)


def get_file_name():
    return os.path.join("resources", input("Enter file name: "))


if __name__ == '__main__':
    f_name = get_file_name()

    selection = "start"
    while selection not in "129exit":
        selection = input("Enter an option. '1' to parse the file. '2' to cut it. 'exit' to quit: ")
        if selection == "exit":
            quit(0)


    if selection[0] == "1":
        parse_json(f_name)

    if selection[0] == "2":
        split_json(f_name, int(input("Number of lines: ")))
