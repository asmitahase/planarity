$(document).ready(function () {

    $(".btn").click(getInputAndReload);

    let level = 4;
    let graph = new Graph("playground", fps = 30, editable = true, buildable = false)

    loadGame(level);

    function loadGame(level) {
        drawGraph(level);
        $("#solved").html("");
        $("#level").html(`You're playing level ${level}`);
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

    function drawGraph(level_n) {
        // Erase old graph
        Object.values(graph.objs).map(node => node.delete());

        // Set global level variabe
        level = level_n;

        // Make sure levels don't become exponentially difficult
        let n_lines = Math.ceil(Math.sqrt(2 * (level + 1)));
        let lines = randomLines(n_lines);

        let nodes = {};
        let coordinates = {};

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

    function resizeCanvas() {
        let context = $("#playground").get(0).getContext("2d");
        context.canvas.height = $(".game-area").height() * 0.95;
        context.canvas.width = $(".game-area").width() * 0.95;

        Object.values(graph.objs).map(node => {
            node.x = Math.random() * context.canvas.width;
            node.y = Math.random() * context.canvas.height;
        })
    };

    function graph_intersects(graph) {
        let date = new Date()
        // Evaluation function seems to be slow. 
        // Don't evaluate on every tick
        if (date.getTime() % 1000 > 50) {
            return
        }
        let is_solved = true;
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
                                // The intersecting edge must not be on node and neigbour vertices
                                if (node.id != start && node.id != end && neighbour.id != start && neighbour.id != end) {
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
            // The game is solved. Move to next level
            $("#solved").html(`Congratulations, You've completed level ${level}`);
            loadGame(level + 1);
            return;
        }
    };

    resizeCanvas();
    graph.setTickCallback(graph_intersects);

    $(window).resize(function () {
        resizeCanvas();
    });

});
