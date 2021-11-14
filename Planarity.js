$(document).ready(function() {

    $(".btn").click(getInputAndReload);


    function loadGame(level=4){
        $("#text").html(`game load with level ${level}`);
    }

    function getInputAndReload(){
        level = document.getElementById('input_id').value;
        loadGame(level);
    }
    function renderGraph(){
        return graphDS;
    }
    function drawGraph(graphDS){

        let nodes = {
        1: [2,3,4],
        2: [1,3,4],
        3: [1,2,4],
        4: [1,2,3],
        };
        let coordinates = {
            1: [100, 100],
            2: [100, 200],
            3: [200, 100],
            4: [200, 200],
        };

        let graph = new Graph("playground", fps=60, editable=true, buildable=false)

        // Draw all nodes;
        let node_objects = {};
        Object.keys(nodes).map(
            node => {
                let x = coordinates[node][0];
                let y = coordinates[node][1];
                node_objects[node] = graph.node(x, y, 10);
            }
        );

        // Draw all edges
        Object.entries(nodes).map(
            entry => {
                let node = entry[0];
                let neighbours = entry[1];
                //console.log("Node", node, "Connects to", neighbours);
                neighbours.map(neighbour => {
                    if (node < neighbour) {
                        node_objects[node].connect(node_objects[neighbour]);
                    }
                });
            }
        );

    }   
        
    // Reference
    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    // https://stackoverflow.com/a/24392281
    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    function intersects(a,b,c,d,p,q,r,s) {
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

    function graph_intersects(graph) {
        let nodes = graph.objs;
        let is_solved = true;

        Object.values(nodes).map(
            node => {
        
                node.children.map(
                    child=> {
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
            console.log(is_solved);
        }
    };
    // graph.setTickCallback(graph_intersects);


});
