# Development

## Table of Contents

- [Development](#development)
  - [Table of Contents](#table-of-contents)
  - [Codebase Walkthrough](#codebase-walkthrough)
    - [Branches](#branches)
    - [Hymns](#hymns)
    - [Layouts](#layouts)
    - [Static Files](#static-files)
    - [Scripts](#scripts)
  - [Deployment](#deployment)
    - [New Hymns](#new-hymns)
      - [1. Add to index](#1-add-to-index)
      - [2. Add to cache](#2-add-to-cache)
    - [Deploy](#deploy)

## Codebase Walkthrough

### Branches

There are 2 branches in the repo as of now: `main` and `gh-pages`.

`main` contains all the development code, while `gh-pages` contains the code
being served live on [https://youthhymns.church.org.sg](https://youthhymns.church.org.sg)
via Github Pages.

A third `development` branch might be added in the future if necessary.

### File Structure Overview

```
├───archetypes
├───content
│   ├───chinese
│   └───english
├───layouts
│   └───_default
├───node_modules
├───public
├───resources
└───static
    ├───icons
    └───js
```

The `archetypes`, `node_modules`, `resources` and `public` directories can be ignored for general
development purposes.

`content` contains the Markdown files for the hymn lyrics.

`layouts` contains the HTML pages.

`static` contains the scripts and other static files for the site.

### Hymns

The hymn lyrics can be found in the ["content" directory](./content/hymns/).
They are named according to their hymn number (e.g. hymn number 200 would be `200.md`).

At the top of each file, there is a block of text enclosed in 3 dashes (`---`) known as "frontmatter".

```
---
title: You Are My Strength
medleyFrom: 0
medleyTo: 0
---
```

The frontmatter contains metadata of each file, which in our case are the hymn's title, and medleys.

Another important thing to know is that each line in the hymn needs to end with 2 spaces.
This is to let Markdown know to start a new line.

```
...
**Verse 1**  <- 2 spaces!
You are my strength when I am weak  <- 2 spaces!
You are the treasure that I seek  <- 2 spaces!
You are my All in All.
...
```

### Layouts

The HTML layouts can be found in the ["layouts" directory](./layouts/).
The layouts are written in HTML, with [Hugo's templating syntax](https://gohugo.io/templates/introduction/).

### Static Files

Static files such as icons, CSS and scripts can be found in the ["static" directory](./static/).

### Scripts

For development, there is a script for generating the base
template of a hymn file: [newHymn.sh](./newHymn.sh)

For deployment, the few important scripts used are:

- [Gruntfile.js](./Gruntfile.js)
- [generateCache.js](./generateCache.js)
- [deploy.sh](./deploy.sh)

These will be explained further in the
[deployment section below](#deployment)

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
"/hymns/1/",
"/10/",
"/151/",
...
"/69/",
"/81/",
"/99/",
```

Copy the whole output and paste it as a parameter in the `addResourcesToCache` function call:

```
    ...
    addResourcesToCache([
      "/",
      "/js/script.js",
      "/js/resize.js",
      "/hymns/1/",
      "/hymns/10/",
      "/hymns/151/",
      ...
      "/hymns/69/",
      "/hymns/81/",
      "/hymns/99/",
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

That's all! Now you can head over to [https://youthhymns.church.org.sg](https://youthhymns.church.org.sg) to view the changes.
