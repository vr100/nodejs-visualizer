# Helper scripts

###	csv-to-json.py

	 python3 csv-to-json.py --csv_path <csv-path> --json_path <json-path>

This script converts the given csv file to json and saves it in the given json path

### get-events-classification.py

	python3 get-events-classification.py --data_path <path-to-nfl-data-downloaded-from-kaggle> --output_path <output-json-file>

This script generates a json file containing all unique values of *playType*, *offenseFormation*, *passResult* and *typeDropback* fields.

It also generates the unique *events* for each passResult *[C, I, S, IN, R]*

### get-nfl-info-helper.sh

	export data_path=<path-to-nfl-data-downloaded-from-kaggle>
	export output_path=<output-folder>
	./get-nfl-info-helper.sh

This is a helper script to run the ***get-nfl-info.py*** script for all the weeks in the downloaded data

### get-nfl-info.py

	python3 get-nfl-info.py --data_path <path-to-specific-week-csv-file> --play_data_path <path-to-plays-csv-file> --output_path <output-path>

This script converts a week's csv file to visualizer friendly folders containing json files. (This script uses the week csv and play csv from the nfl data downloaded from kaggle)

### get-unique-events.py

	python3 get-unique-events.py --data_path <path-to-nfl-data-downloaded-from-kaggle> --output_path <output-json-file>

This script generates all the unique events in the dataset across all weeks
