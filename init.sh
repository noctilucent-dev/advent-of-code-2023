#!/bin/bash

day="day$1"

echo "Setting up for $day"

if [[ -e $day ]]; then
    echo "./$day already exists"
    exit 1
fi

mkdir $day
cd $day

touch input.txt

cp ../util/template.js ./index.js

echo "Done"