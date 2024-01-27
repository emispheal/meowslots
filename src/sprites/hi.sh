#!/bin/bash

for file in tile*.png; do
    newname="${file/tile/cat}" 
    mv "$file" "$newname"      
done