# Development

## Table of Contents

- [Development](#development)
  - [Table of Contents](#table-of-contents)
  - [Deployment](#deployment)
    - [New Hymns](#new-hymns)
      - [1. Add to index](#1-add-to-index)
      - [2. Add to cache](#2-add-to-cache)
    - [Deploy](#deploy)

## Deployment

### New Hymns

If new hymns are added, they need to be added to
the search index ([PagesIndex.json](./static/js/lunr/PagesIndex.json))
as well as the Service Worker cache ([sw.js](./static/sw.js))

#### 1. Add to index

To add them to the search index, simply run:

```
grunt lunr-index
```

This triggers the `lunr-index` Grunt task in [Gruntfile.js](./Gruntfile.js) and automatically updates PagesIndex.json

#### 2. Add to cache

Next, to add the hymns to the cache, first run [generateCache.js](./generateCache.js):

```
node generateCache.js
```

which will print an output that looks like this:

```
"/cis-youth-hymnal-v2/hymns/1/",
"/cis-youth-hymnal-v2/hymns/10/",
"/cis-youth-hymnal-v2/hymns/151/",
...
"/cis-youth-hymnal-v2/hymns/69/",
"/cis-youth-hymnal-v2/hymns/81/",
"/cis-youth-hymnal-v2/hymns/99/",
```

Copy the whole output and paste it as a parameter in the `addResourcesToCache` function call:

```
    ...
    addResourcesToCache([
      "/cis-youth-hymnal-v2/",
      "/cis-youth-hymnal-v2/js/script.js",
      "/cis-youth-hymnal-v2/js/resize.js",
      "/cis-youth-hymnal-v2/hymns/1/",
      "/cis-youth-hymnal-v2/hymns/10/",
      "/cis-youth-hymnal-v2/hymns/151/",
      ...
      "/cis-youth-hymnal-v2/hymns/69/",
      "/cis-youth-hymnal-v2/hymns/81/",
      "/cis-youth-hymnal-v2/hymns/99/",
    ])
    ...
```

> NOTE: Do **NOT** remove the top 3 lines that cache the index route and the Javascript files.  
> Also, yes, I know that the way the cache is updated is very scuffed, but I'm not sure how better to do it

### Deploy

Now moving on to actually building and pushing the new code.

Firstly, ensure that the working directory is clean by running

```
git status
```

If the working directory is clean, you should see something like

```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

Otherwise, commit/discard your changes accordingly before proceeding.

Then, simply run [deploy.sh](./deploy.sh) using Bash.

```
bash deploy.sh
```

> [deploy.sh](./deploy.sh) runs the `hugo` command to build the project into the `public/` directory,
> then does some Git magic to push it to the `gh-pages` branch without messing up the main branch

That's all! Now you can head over to [notyumin.github.io/cis-youth-hymnal-v2](https://notyumin.github.io/cis-youth-hymnal-v2) to view the changes.
