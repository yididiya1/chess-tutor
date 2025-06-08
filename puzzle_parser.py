#!/usr/bin/env python3
import csv
import json
import argparse
import sys

def csv_to_json(input_path, num_rows):
    """
    Reads the given CSV and returns up to num_rows items in the format:
    [
        {
            "fen": "...",
            "moves": "...",
            "rating": 1900,
            "type": "crushing hangingPiece long middlegame"
        },
        ...
    ]
    """
    results = []
    with open(input_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for i, row in enumerate(reader):
            if i >= num_rows:
                break
            # Build the object using only the needed fields
            obj = {
                "fen": row["FEN"],
                "moves": row["Moves"],
                # try to coerce rating to int, fall back to original string
                "rating": int(row["Rating"]) if row["Rating"].isdigit() else row["Rating"],
                "type": row["Themes"]
            }
            results.append(obj)
    return results

def main():
    parser = argparse.ArgumentParser(
        description="Convert a chess-puzzle CSV into a trimmed JSON array."
    )
    parser.add_argument(
        "--input", "-i",
        required=True,
        help="Path to the input CSV file"
    )
    parser.add_argument(
        "--num-rows", "-n",
        type=int,
        required=True,
        help="Maximum number of rows to read and convert"
    )
    parser.add_argument(
        "--output", "-o",
        help="Optional path to write the JSON output (defaults to stdout)"
    )
    args = parser.parse_args()

    data = csv_to_json(args.input, args.num_rows)
    json_text = json.dumps(data, indent=2)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(json_text)
    else:
        sys.stdout.write(json_text)

if __name__ == "__main__":
    main()


# python3 csv_to_json.py -i puzzles.csv -n 50 > puzzles.json