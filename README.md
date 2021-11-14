# [Planarity](https://asmitahase.github.io/planarity/)
Planarity is a puzzle based on the concept of [Planar Graphs](https://en.wikipedia.org/wiki/Planar_graph).

Live at: [asmitahase.github.io/planarity](https://asmitahase.github.io/planarity)

## Contents
- [Description](https://github.com/asmitahase/planarity#Description)
- [Gameplay](https://github.com/asmitahase/planarity#GamePlay)
- [Screenshots](https://github.com/asmitahase/planarity#Screenshots)
- [TechStack](https://github.com/asmitahase/planarity#TechStack)
- [Contributors](https://github.com/asmitahase/planarity#Contributors)
- [License](https://github.com/asmitahase/planarity#License)

## Description

A planar graph is a graph that can be drawn on a 2D plane such that the edges intersect only at the vertices. The goal of the puzzle is to untangle the graph to reveal its planar nature.

### Generating puzzle piece
The game uses [John Tantalo](http://johntantalo.com/)'s [algorithm](http://johntantalo.com/wiki/Planarity/) to generate planar graphs.

1. Generate a set of random lines in a plane such that no two lines are parallel

![geogebra 1](https://user-images.githubusercontent.com/8528887/141686114-ebf4397a-4ad8-40f0-9cec-f1ff9e2d8892.png)


2. Calculate the intersections of each pair of lines

![geogebra 2](https://user-images.githubusercontent.com/8528887/141686113-f63707a9-174e-4647-b632-4f61d824cf97.png)


3. Mark the intersection points as vertices and segments as edges of the graph 

![geogebra 3](https://user-images.githubusercontent.com/8528887/141686111-3c78f455-4aba-4010-aeef-7e5c63587cd8.png)

![geogebra 4](https://user-images.githubusercontent.com/8528887/141686109-b3c4db22-ff17-4792-87f7-04e018f60bc4.png)

The vertices of the graph are then randomly shuffled to get the final topology of the graph aka the puzzle piece


## GamePlay

1. You'll be presented with a planer tangled graph at level 4 at the beginning.
2. Move the nodes with your mouse to untangle the graph and reach next level 

## Screenshots

![screenshot](https://imgur.com/LKyVFOm.png)

## TechStack
- [Javascript](https://en.wikipedia.org/wiki/JavaScript)
- [HTML](https://en.wikipedia.org/wiki/HTML)
- [CSS](https://en.wikipedia.org/wiki/CSS)
- [jQuery](https://jquery.com/)
- [Tailwind](https://tailwindcss.com/)
- [Graph.js](https://github.com/paulfears/Graphs)

## Contributors
- Asmita Hase
- Aditya Hase


