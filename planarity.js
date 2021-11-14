$(document).ready(function () {

    $(".btn").click(getInputAndReload);
    var level = 4;
    var is_solved = true;
    var graph;
    loadGame(level);

    function loadGame(level) {
        drawGraph(level);
        $("#text").html(`game load with level ${level}`);
    }

    function getInputAndReload() {
        level = document.getElementById('input_id').value;
        loadGame(level);
    }
    function randomLines(n) {
        // Generate lines with different slopes
        let slopes = [];
        let lines = [];
        while (lines.length < n) {
            let slope = Math.random();
            let intercept = Math.random();

            if (!slopes.includes(slope)) {
                slopes.push(slope);
                lines.push([slope, intercept]);
            }
        }
        return lines;
    }

    function intersection(m1, c1, m2, c2) {
        let xInterect = (c2 - c1) / (m1 - m2);
        let yIntersect = m1 * xInterect + c1;
        return [xInterect, yIntersect];
    }

    function drawGraph(level) {

        let lines = randomLines(level);

        let nodes = {
        };
        let coordinates = {
        };

        graph = new Graph("playground", fps = 10, editable = true, buildable = false)

        lines.map((line, ii) => {
            let intersections = [];

            lines.map((another, jj) => {
                if (ii != jj) {
                    let intersect = intersection(line[0], line[1], another[0], another[1]);
                    let index = (ii + 1) * (jj + 1);
                    coordinates[index] = intersect;
                    if (nodes[index] === undefined) {
                        nodes[index] = [];
                    }
                    intersections.push([intersect, index]);
                }

            });
            intersections.sort((a, b) => a[0][0] - b[0][0]);
            intersections.map(e => console.log(e[0], e[1]));

            intersections.map((current, index) => {
                if (index == intersections.length - 1) {
                    return
                }
                next = intersections[index + 1];
                nodes[current[1]].push(next[1]);

            });

        });

        let node_objects = {};
        Object.keys(nodes).map(
            node => {
                // Shuffle coordinates to make the graph look tangled
                // Because only the topology of the graph is important

                // TODO: Use interesting random distributions here
                let x = Math.random() * 500;
                let y = Math.random() * 500;

                node_objects[node] = graph.node(x, y, 10);
            }
        );

        // Draw all edges
        Object.entries(nodes).map(
            entry => {
                let node = entry[0];
                let neighbours = entry[1];
                neighbours.map(neighbour => {
                    node_objects[node].connect(node_objects[neighbour]);
                })
            }
        )
    }

    // Reference
    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    // https://stackoverflow.com/a/24392281
    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    function intersects(a, b, c, d, p, q, r, s) {
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    };

    function graph_intersects(graph, level) {
        let nodes = graph.objs;
        Object.values(nodes).map(
            node => {

                node.children.map(
                    child => {
                        let neighbour = nodes[child];


                        let edges = graph.edges;
                        Object.values(edges).map(
                            edge => {
                                let start = edge.startNodeid;
                                let end = edge.endNodeid;
                                if (node.id != start && node.id != end) {
                                    let startNode = nodes[start];
                                    let endNode = nodes[end];
                                    let doesIt = intersects(node.x, node.y, neighbour.x, neighbour.y, startNode.x, startNode.y, endNode.x, endNode.y);
                                    if (doesIt) {
                                        is_solved = false;
                                    }
                                }

                            }
                        )
                    }
                )
            }
        );
        if (is_solved) {
            return;
        }
    };

    function resizeCanvas() {
        let context = $("#playground").get(0).getContext("2d");
        context.canvas.height = $(".game-area").height() * 0.95;
        context.canvas.width = $(".game-area").width() * 0.95;

    };

    resizeCanvas();
    graph.setTickCallback(graph_intersects);




});
