# Build using Hugo
hugo

# Push to gh-pages
git add public
read -p "Commit message: " -r
git commit -m "$REPLY"
git subtree push --prefix public origin gh-pages
