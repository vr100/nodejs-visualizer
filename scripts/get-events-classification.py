import pandas as pd
import argparse, os, json, fnmatch

PLAY_PREFIX = "plays"
TRACK_PREFIX = "week"

EVENT_COL = "event"
PLAYTYPE_COL = "playType"
OFFENSE_COL = "offenseFormation"
PASSRESULT_COL = "passResult"
DROPBACK_COL = "typeDropback"
PLAYID_COL = "playId"
GAMEID_COL = "gameId"

NULL_ENTRY = "NULL"

def parse_args():
	parser = argparse.ArgumentParser()
	parser.add_argument(
		"--data_path", type=str, help="specifies the path for data folder",
		required=True)
	parser.add_argument(
		"--output_path", type=str, help="specifies the output json file path",
		required=True)
	parser.add_argument(
		"--debug", type=bool, help="if specified, will enable debug mode",
		default=False)
	return vars(parser.parse_args())

def serialize_sets(obj):
	if isinstance(obj, set):
		return sorted(list(obj))
	return obj

def get_unique_values(data, col):
	unique_data = list(data[col].dropna().unique());
	return unique_data

def get_classification_info(data, class_data, debug):
	pass_values = data[PASSRESULT_COL].dropna().unique()
	temp_class_data = {}
	for value in pass_values:
		temp_class_data[value] = set()
		event_values = data[data[PASSRESULT_COL] == value][EVENT_COL].unique()
		temp_class_data[value].update(event_values)
	null_pass_events = data[data[PASSRESULT_COL].isnull()][EVENT_COL].unique()
	if null_pass_events.size != 0:
		temp_class_data[NULL_ENTRY] = set()
		temp_class_data[NULL_ENTRY].update(null_pass_events)

	if debug:
		json_data = json.dumps(temp_class_data, indent=2, default=serialize_sets)
		print(json_data)

	for value in temp_class_data:
		if value not in class_data:
			class_data[value] = set()
		class_data[value].update(temp_class_data[value])
	return


def get_events_classification(data_path, output_path, debug):
	play_file = os.path.join(data_path, "{}.csv".format(PLAY_PREFIX))
	play_data = pd.read_csv(play_file)
	data = {}
	data[PLAYTYPE_COL] = get_unique_values(play_data, PLAYTYPE_COL)
	data[OFFENSE_COL] = get_unique_values(play_data, OFFENSE_COL)
	data[PASSRESULT_COL] = get_unique_values(play_data, PASSRESULT_COL)
	data[DROPBACK_COL] = get_unique_values(play_data, DROPBACK_COL)

	track_files = fnmatch.filter(os.listdir(data_path), "{}*.csv".format(
		TRACK_PREFIX))
	class_data = {}
	for tf in track_files:
		print("Using tracking data file {}".format(tf))
		file_path = os.path.join(data_path, tf)
		track_data = pd.read_csv(file_path)
		join_data = pd.merge(track_data, play_data, on=[GAMEID_COL, PLAYID_COL],
			how="left")[[PASSRESULT_COL, EVENT_COL]]
		get_classification_info(join_data, class_data, debug)
	data.update(class_data)

	json_data = json.dumps(data, indent=2, default=serialize_sets)
	with open(output_path, "w") as output:
		output.write(json_data)

def main():
	args = parse_args()
	print("Args: {}".format(args))
	data_path = os.path.abspath(args["data_path"])
	output_path = os.path.abspath(args["output_path"])
	debug = args["debug"]

	get_events_classification(data_path, output_path, debug)
	print("Finished getting all unique events in {}".format(data_path))

main()
