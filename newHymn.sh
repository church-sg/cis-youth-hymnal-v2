#!/bin/bash

# Requires Gum to be installed: https://github.com/charmbracelet/gum
LANG=$(gum choose "English" "Chinese")
LANG_LOWER=${LANG,,}
HYMN_NO=$(gum input --placeholder "Hymn Number")

echo "$LANG Hymn $HYMN_NO"

TITLE=$(gum input --placeholder "Title")

TITLE_ARRAY=($TITLE)

echo "Creating Hymn $HYMN_NO: ${TITLE_ARRAY[@]^}..."

# https://www.linuxquestions.org/questions/programming-9/bash-scripting-capitalizing-first-letter-or-each-word-in-a-string-268182/
echo "---
title: ${TITLE_ARRAY[@]^}
medleyFrom: 0
medleyTo: 0
---

" >>./content/$LANG_LOWER/$HYMN_NO.md
