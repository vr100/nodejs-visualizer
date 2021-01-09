#!/bin/bash
for filename in $data_path/week*.csv; do
  cmd="basename $filename .csv"
  echo $cmd
  basename=`$cmd`
  if [[ $basename =~ week* ]]; then
    mkdir $output_path/$basename
    cmd="python3 get-nfl-info.py --data_path $data_path/$basename.csv --play_data_path $data_path/plays.csv --output_path $output_path/$basename"
    echo $cmd
    $cmd
  else
    echo "invalid basename $basename, exiting"
    exit -1
  fi
done
