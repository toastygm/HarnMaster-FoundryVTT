#!/bin/bash
for i in hmk-characters hmk-creatures hmk-characteristics hmk-mysteries hmk-possessions; do
    ./build-pack.sh $i
    [ $? ] || exit 1
done
