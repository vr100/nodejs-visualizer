import pandas as pd
import argparse, os

GAME_ID = "gameId"
PLAY_ID = "playId"
FRAME_ID = "frameId"

PLAY_OUTPUT = "play"

def parse_args():
	parser = argparse.ArgumentParser()
	parser.add_argument(
		"--data_path", type=str, help="specifies the path for data file",
		required=True)
	parser.add_argument(
		"--game_data_path", type=str, help="specifies the path for game file",
		required=True)
	parser.add_argument(
		"--output_path", type=str, help="specifies the output folder path",
		required=True)
	return vars(parser.parse_args())

def write_json_data(data, output_folder, output_file):
	json_data = data.to_json(orient="records", indent=2)
	output_path = os.path.join(output_folder, output_file)
	with open(output_path, "w") as output:
		output.write(json_data)

def get_data_for_play(data, output_folder, play, game, game_csv):
	print("Getting data for play: {}".format(play))

	game_data = game_csv[(game_csv[GAME_ID] == game) &
		(game_csv[PLAY_ID] == play)]
	write_json_data(game_data, output_folder, "{}.json".format(PLAY_OUTPUT))

	frames = sorted(data[FRAME_ID].unique())
	for frame in frames:
		frame_data = data[data[FRAME_ID] == frame]
		write_json_data(frame_data, output_folder, "{}.json".format(frame))

def get_all_play_data(data, output_path, game, game_csv):
	plays = sorted(data[PLAY_ID].unique())
	print("Total plays: {} for game {}".format(len(plays), game))
	for play in plays:
		output_folder = os.path.join(output_path, "{}".format(play))
		os.mkdir(output_folder)
		play_data = data[data[PLAY_ID] == play]
		get_data_for_play(play_data, output_folder, play, game, game_csv)

def get_all_game_data(data, game_csv, output_path):
	games = sorted(data[GAME_ID].unique())
	print("Total games: {}".format(len(games)))
	for game in games:
		output_folder = os.path.join(output_path, "{}".format(game))
		os.mkdir(output_folder)
		game_data = data[data[GAME_ID] == game]
		get_all_play_data(game_data, output_folder, game, game_csv)

def main():
	args = parse_args()
	print("Args: {}".format(args))
	data_path = os.path.abspath(args["data_path"])
	game_path = os.path.abspath(args["game_data_path"])
	output_path = os.path.abspath(args["output_path"])

	data = pd.read_csv(data_path)
	game = pd.read_csv(game_path)
	get_all_game_data(data, game, output_path)
	print("Finished getting data for all games in {}".format(data_path))

main()