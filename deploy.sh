# Build using Hugo
hugo

STATUS="$(git status)"

if [[ $STATUS == *"nothing to commit, working tree clean"* ]]
then
    # remove public directory from gitignore
    sed -i "" '/public/d' ./.gitignore
    git add .
    git commit -m "Edit .gitignore to publish"

    # push "public" to gh-pages branch
    git push origin `git subtree split --prefix public main`:gh-pages --force
    git reset HEAD~
    git checkout .gitignore
else
    echo "Need clean working directory to publish"
fi
