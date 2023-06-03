# Build using Hugo

STATUS="$(git status)"

if [[ $STATUS == *"nothing to commit, working tree clean"* ]]
then
    rm public/ -rf
    hugo # build using hugo
    # add CNAME to public/
    echo "youthhymns.church.org.sg" > public/CNAME
    git add public/ -f # force add public/ (cuz it's ignored)
    git commit -m "Commit to deploy"
    git push origin `git subtree split --prefix public main`:gh-pages --force
    git reset HEAD~
else
    echo "Need clean working directory to publish"
fi
