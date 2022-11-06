#!/bin/sh

modified_files=`git ls-files --other --modified --exclude-standard`

for file_path in $modified_files
do
    prettier --write $file_path
done
