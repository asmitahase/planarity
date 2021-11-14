# [Planarity](https://asmitahase.github.io/planarity/)

Live at: [asmitahase.github.io/planarity](https://asmitahase.github.io/planarity)

![screenshot](https://user-images.githubusercontent.com/8528887/141679197-0a2aa9db-1c14-4c40-9ac6-4d730c24f3d3.png)

Planarity is a puzzle based on the concept of [Planar Graphs](https://en.wikipedia.org/wiki/Planar_graph).

Built using Javascript, HTML and CSS

A planar graph is a graph in which the edges intesect only at the vertices. The goal of the puzzle is to untangle the graph to reveal its planar nature.

## Generating puzzle piece
The game uses [John Tantalo](http://johntantalo.com/)'s [algorihtm](http://johntantalo.com/wiki/Planarity/) to generate planar graphs.

1. Generate a set of random lines in a plane such that no two lines are parallel
2. Calculate the intersections of each pair of lines
3. Mark the intersection points as vertices and segments as edges of the graph 

The vertices of the graph are then randomly shuffled to get the final topology of the graph aka the puzzle piece

Graphs are drawn using [Graph.js](https://github.com/paulfears/Graphs), a libary to draw interactive graphs on HTML canvas by [Paul Fears](https://paulrfears.com/)


