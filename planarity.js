$(document).ready(function () {
    let level = 4;
    let graph = new Graph("playground", fps = 15, editable = true, buildable = false)

    window.graph = graph;
    load_game(level);

    function load_game(level) {
        draw_graph(level);
        graph.busy_drawing = false;
        $("#solved").html("");
        $("#level").html(`You're playing level ${level}`);
    }

    function generate_random_lines(n) {
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

    function draw_graph(level_n) {
        // Erase old graph
        Object.values(graph.objs).map(node => node.delete());

        // Set global level variabe
        level = level_n;

        // Make sure levels don't become exponentially difficult
        let n_lines = Math.ceil(Math.sqrt(2 * (level + 1)));
        let lines = generate_random_lines(n_lines);

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

    function resize_canvas() {
        let context = $("#playground").get(0).getContext("2d");
        context.canvas.height = $(".game-area").height() * 0.95;
        context.canvas.width = $(".game-area").width() * 0.95;

        Object.values(graph.objs).map(node => {
            node.x = Math.random() * context.canvas.width;
            node.y = Math.random() * context.canvas.height;
        })
    };

    function graph_intersects(graph) {
        if (graph.busy_drawing) {
            return;
        }
        let date = new Date()
        // Evaluation function seems to be slow. 
        // Don't evaluate on every tick
        if (date.getTime() % 1000 > 500) {
            return
        }
        let is_solved = true;
        let nodes = graph.objs;
        let edges = graph.edges;

        Object.values(edges).map(first => {
            let edge_intersects = false;
            Object.values(edges).map(second => {
                if ((first.id != second.id) && (
                    ![first.startNodeid, first.endNodeid].includes(second.startNodeid) &&
                    ![first.startNodeid, first.endNodeid].includes(second.endNodeid)
                )) {
                    let first_start = nodes[first.startNodeid];
                    let first_end = nodes[first.endNodeid];
                    let second_start = nodes[second.startNodeid];
                    let second_end = nodes[second.endNodeid];
                    if (intersects(first_start.x, first_start.y, first_end.x, first_end.y, second_start.x, second_start.y, second_end.x, second_end.y)) {
                        // First edge intersects some another edge
                        // Mark it red
                        edge_intersects = true;
                    }
                }
            });
            if (edge_intersects) {
                is_solved = false;
                first.color = "#DC2626";
            } else {
                // First edge doesn't intersects any node
                // Mark it green
                first.color = "#047857";
            }
        });

        if (is_solved) {
            // The game is solved. Move to next level
            $("#level").html("");
            $("#solved").html(`Congratulations, You've completed level ${level}`);

            graph.busy_drawing = true;
            setTimeout(() => load_game(level + 1), 2000);
            return;
        }
    };

    resize_canvas();
    graph.setTickCallback(graph_intersects);

    $(window).resize(function () {
        resize_canvas();
    });

});
