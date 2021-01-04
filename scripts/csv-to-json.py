import csv, json, os, argparse

def csv_to_json(csv_path, json_path):
	json_list = []
	with open(csv_path, "r") as csv_file:
		reader = csv.DictReader(csv_file)
		json_data = []
		for row in reader:
			json_list.append(row)
	json_data = json.dumps(json_list, indent=4)
	with open(json_path, "w") as json_file:
		json_file.write(json_data)
	print("Json file saved to {}".format(json_path))

def parse_args():
	parser = argparse.ArgumentParser()
	parser.add_argument(
		"--json_path", type=str, help="specifies the path for output json file",
		required=True)
	parser.add_argument(
		"--csv_path", type=str, help="specifies the path for csv file",
		required=True)
	return vars(parser.parse_args())

def main():
	args = parse_args()
	print("Args: {}".format(args))
	csv_path = os.path.abspath(args["csv_path"])
	json_path = os.path.abspath(args["json_path"])
	csv_to_json(csv_path, json_path)

main()
