#!/bin/bash

# Requires Gum to be installed: https://github.com/charmbracelet/gum
HYMN_NO=$(gum input --placeholder "Hymn Number")

echo "Hymn $HYMN_NO"

TITLE=$(gum input  --placeholder "Title")

TITLE_ARRAY=($TITLE)

echo "Creating Hymn $HYMN_NO: ${TITLE_ARRAY[@]^}..."

# https://www.linuxquestions.org/questions/programming-9/bash-scripting-capitalizing-first-letter-or-each-word-in-a-string-268182/
echo "---
title: ${TITLE_ARRAY[@]^}
medleyFrom: 0
medleyTo: 0
---

" >> ./content/hymns/$HYMN_NO.md
