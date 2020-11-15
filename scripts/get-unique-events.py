import pandas as pd
import argparse, os, fnmatch, json

TRACK_PREFIX = "week"
EVENT_COL = "event"

def parse_args():
	parser = argparse.ArgumentParser()
	parser.add_argument(
		"--data_path", type=str, help="specifies the path for data folder",
		required=True)
	parser.add_argument(
		"--output_path", type=str, help="specifies the output json file path",
		required=True)
	return vars(parser.parse_args())

def get_all_events(data_path, output_path):
	track_files = fnmatch.filter(os.listdir(data_path), "{}*.csv".format(
		TRACK_PREFIX))
	events = set()
	for tf in track_files:
		print("Getting events from {}".format(tf))
		file_path = os.path.join(data_path, tf)
		data = pd.read_csv(file_path)
		event_data = data[EVENT_COL].unique()
		events.update(event_data)
	events = list(sorted(events))
	json_data = json.dumps(events, indent=2)
	with open(output_path, "w") as output:
		output.write(json_data)

def main():
	args = parse_args()
	print("Args: {}".format(args))
	data_path = os.path.abspath(args["data_path"])
	output_path = os.path.abspath(args["output_path"])

	get_all_events(data_path, output_path)
	print("Finished getting all unique events in {}".format(data_path))

main()
