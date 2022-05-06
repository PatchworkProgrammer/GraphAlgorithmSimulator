var node_count = -1;
var left_offset = 100;
var top_offset = 50;
var adjList = [];
var connector_list = [];
var src = 0;
var graph_states = [];
var current_state = 0;
var directed_bool = null;
var weighted_bool = null;


function getEdgeWeight(fromIdx, toIdx) {
    weight = -1;

    for (var i = 0; i < adjList[fromIdx].length; i++) {
        if (adjList[fromIdx][i][0] == toIdx) {
            weight = adjList[fromIdx][i][1];
            break;
        }
    }

    return weight;
}


function findConnectorByEndpoints(fromIdx, toIdx) {


    for (var i = 0; i < connector_list.length; i++) {

        if (parseInt(connector_list[i].sourceId.slice(4)) == fromIdx && parseInt(connector_list[i].targetId.slice(4)) == toIdx) {
            return connector_list[i];
        }
    }

    return null;
}



/**
 * @param {string | number} fromIdx
 * @param {any} toIdx
 */
function EdgeAlreadyExists(fromIdx, toIdx) {
    for (var i = 0; i < adjList[fromIdx].length; i++) {
        // 3d array ?
        if (adjList[fromIdx][i][0] == toIdx) {
            return true;
        }
    }

    if( !directed_bool ) {
        for (var i = 0; i < adjList[toIdx].length; i++) {
            // 3d array ?
            if (adjList[toIdx][i][0] == toIdx) {
                return true;
            }
        }
    }
    return false;
}

function printAdjList() {
    console.log("called printAdjList");
    for (var i = 0; i < adjList.length; i++) {
        console.log(adjList[i]);
    }

}

function removeFromAdjList(fromIdx, toIdx){

    var idx2 = -1;
    for (var i = 0; i < adjList[fromIdx].length; i++) {
        if (adjList[fromIdx][i][0] == toIdx) {
            idx2 = i;
            break;
        }
    }

    if (idx2 != -1) {
        adjList[fromIdx].splice(idx2, 1);
    }


    if (!directed_bool){

        var idx2 = -1;
        for (var i = 0; i < adjList[toIdx].length; i++) {
            if (adjList[toIdx][i][0] == fromIdx) {
                idx2 = i;
                break;
            }
        }

        if (idx2 != -1) {
            adjList[toIdx].splice(idx2, 1);
        }
    }
}


/**
 * Updates the adj list printed on the page, when edges are removed or addded + Adds Overlay (important) + Adds a display for edges (legacy)
 * 
 * @param {{ sourceId: string; targetId: string; addOverlay: (arg0: { type: string; options: { label: any; location: number; cssClass: string; } | { width: number; length: number; location: number; }; }) => void; }} conn
 * @param {boolean} remove
 */

function updateEdges(conn, remove) {

    fromIdx = parseInt(conn.sourceId.slice(4));
    toIdx = parseInt(conn.targetId.slice(4));
   

    if (!remove) {


        //Getting weight by referring to adjList
        weight = getEdgeWeight(fromIdx, toIdx);

        // UPDATING CONSOLE INPUT IF GRAPH CHANGED VIA UI
        
        input = document.getElementById("console_input").value
        

        if (weighted_bool){
            new_entry = fromIdx + " " + toIdx + " " + weight
            if (input.indexOf(new_entry) == -1) {
            first_line = input.split('\n')[0]
            node_num = parseInt(first_line.split(' ')[0])
            edge_num = parseInt(first_line.split(' ')[1]) + 1  //edge added
            document.getElementById("console_input").value = input.replace(first_line, node_num + " " + edge_num + "\n" + new_entry)
            }
        }


        else{
            new_entry = fromIdx + " " + toIdx
            if (input.indexOf(new_entry) == -1) {
            first_line = input.split('\n')[0]
            node_num = parseInt(first_line.split(' ')[0])
            edge_num = parseInt(first_line.split(' ')[1]) + 1  //edge added
            document.getElementById("console_input").value = input.replace(first_line, node_num + " " + edge_num + "\n" + new_entry)
            }


        }
        

        if (weighted_bool) 
            conn.addOverlay({
                type: "Label",
                options: { label: weight, location: 0.5, cssClass: 'custom_overlay' }
            });

        if (directed_bool)
            conn.addOverlay({ type: "PlainArrow", options: { width: 15, length: 25, location: 1 } });


    } else {


        weight = getEdgeWeight(fromIdx, toIdx);

        input = document.getElementById("console_input").value
        first_line = input.split('\n')[0]
        node_num = parseInt(first_line.split(' ')[0])
        edge_num = parseInt(first_line.split(' ')[1]) - 1  //edge removed

        document.getElementById("console_input").value = input.replace(first_line, node_num + " " + edge_num)

        if(weighted_bool)
            document.getElementById("console_input").value = document.getElementById("console_input").value.replace("\n" + fromIdx + " " + toIdx + " " + weight, "")
        else
            document.getElementById("console_input").value = document.getElementById("console_input").value.replace("\n" + fromIdx + " " + toIdx, "")
      

        

        for (var i = 0; i<connector_list.length ;i++){
            if (connector_list[i]==conn){
                connector_list.splice(i,1);
                break;
            }
                
        }
        removeFromAdjList(fromIdx, toIdx);
    }



    // var s = "<span> <strong>Edges</strong> </span> <br/> <br/> \
    //         <table><tr><th>FROM</th><th>_TO_</th><th>WEIGHT</th></tr>";

    // for (var j = 1; j < adjList.length; j++) {
    //     for (var k = 0; k < adjList[j].length; k++) {
    //         s = s + "<tr><td>   " + j + "</td>" + "<td>    " + adjList[j][k][0] + "</td><td>   " + adjList[j][k][1] + "</td></tr>";
    //     }
    // }
    // var edgeDiv = document.getElementById("edgeList");
    // edgeDiv.innerHTML = s;
    // edgeDiv.display = 'block';

};



/**
 * Update vertex weight, predecessor on graph render for current state.
 * Maintain frontier, completed vertex colorings. 
 */
function updateGraphInfo_Dijkstra() {

    var stillInQ = new Array(adjList.length).fill(false);

    //SETS THE NODE_INFO
    for (var i = 0; i < graph_states[current_state].length; i++) {

        nodeIdx = graph_states[current_state][i][0];
        node_id = 'node' + nodeIdx;


        stillInQ[graph_states[current_state][i][0]] = true;

        parentIdx = graph_states[current_state][i][1];
        weight = graph_states[current_state][i][2];

        if (weight == 10000)
            weight = 'inf'

        node = document.getElementById(node_id);


        node.children[0].children[0].children[1].innerHTML = 'P:' + parentIdx;
        node.children[0].children[0].children[2].innerHTML = 'W:' + weight;


    }



    //FIGURES OUT WHICH ELEMENTS WERE NOT IN QUEUE AND CHANGES THE COLORS OF NODES AND EDGES
    for (var i = 0; i < stillInQ.length; i++) {

        node = document.getElementById('node' + i);
        node_weight = node.children[0].children[0].children[2].innerHTML;
        nodeIdx = i;
        parentIdx = parseInt(node.children[0].children[0].children[1].innerHTML.slice(2));

        if (stillInQ[i]) {



            if (node_weight.localeCompare('W:inf') != 0) {
                node.classList.add('node_frontier');


                //SET EDGE COLOR
                if (i != 0) {
                    conn = findConnectorByEndpoints(parentIdx, nodeIdx);
                
                    conn.setType("considered");

                    weight = getEdgeWeight(parentIdx, nodeIdx);
                    conn.addOverlay({
                        type: "Label",
                        options: { label: weight, location: 0.5, cssClass: 'custom_overlay' }
                    });
                    conn.addOverlay({ type: "PlainArrow", options: { width: 15, length: 25, location: 1 } });
                    window.j.repaintEverything();
                }

            }
        }
        else {
            node.classList.remove('node_frontier');
            node.classList.add('node_completed');

            //SET EDGE COLOR
            if (i != 0) {
                conn = findConnectorByEndpoints(parentIdx, nodeIdx);
                conn.setType("final");
                weight = getEdgeWeight(parentIdx, nodeIdx);
                conn.addOverlay({
                    type: "Label",
                    options: { label: weight, location: 0.5, cssClass: 'custom_overlay' }
                });
                conn.addOverlay({ type: "PlainArrow", options: { width: 15, length: 25, location: 1 } });
                window.j.repaintEverything();
            }
        }
    }




    if (current_state <= graph_states.length - 1)
        current_state++;
    else
        alert("End of simulation");

}


function loadGraph() {
    let input = document.getElementById("console_input").value;
    let lines = input.split("/n");
    node_count = lines[0].split(" ")[0];
    let edge_count = lines[0].split(" ")[1];

    let newNodeBtn = document.getElementById("newNodeBtn");
    for (var j = 0; j < node_count; j++) {
        newNodeBtn.click();
    }
}


jsPlumbBrowserUI.ready(function () {

    var instance = window.j = jsPlumbBrowserUI.newInstance({
        dragOptions: { cursor: 'pointer', zIndex: 2000 },
        endpointHoverStyle: { fill: "orange" },
        
        paintStyle: { stroke: "rgb(65, 65, 100)", strokeWidth: 5 },
        hoverPaintStyle: { stroke: "rgb(35, 35, 100)", strokeWidth:8 },
        anchors: ["Continuous", "Continuous"],
        connector: { type: "Bezier", options: { curviness: 23 } },
        dropOptions: { activeClass: "dragActive", hoverClass: "dropHover" },
        Endpoints: ["Blank", "Blank"],
        container: canvas,
        allowLoopback: false
    });




    //DIFFERENT CONNECTION COLORS

    var conn_width = 5
    instance.registerConnectionTypes({
      
        "considered": {
          
            paintStyle: { stroke: " rgb(204, 170, 0)", strokeWidth: conn_width },
            hoverPaintStyle: { strokeWidth: conn_width + 3, stroke: " rgb(255, 220, 30)" },
        },
        "final": {
            
            paintStyle: { stroke: "rgb(17, 134, 13)", strokeWidth: conn_width },
            hoverPaintStyle: { strokeWidth: conn_width + 3, stroke: "rgb(17, 200, 13)" },
        }


    });







    instance.setSuspendDrawing(true);

    instance.bind("connection", function (info, originalEvent) {
        updateEdges(info.connection, false);

    });


    instance.bind("connection:click", function (connection, originalEvent) {
        instance.deleteConnection(connection);
        updateEdges(connection, true);
    });


    //WICHTIG: USED TO INSERT THE WEIGHT FROM INPUT WHEN ADDING EDGES (MAY ADD POPUPS LATER)
    instance.bind("beforeDrop", function (info, originalEvent) {
       
        
        fromIdx = parseInt(info.connection.sourceId.slice(4));
        toIdx = parseInt(info.connection.targetId.slice(4));
        weight = parseInt(document.getElementById('weightInput').value);
       

        if ( fromIdx==toIdx )
            return false

        
       
        if (weighted_bool && isNaN(weight)){
            
            alert("No Edge Weight given")
            return false;
        }

        if (EdgeAlreadyExists(fromIdx, toIdx) ){
            alert("Edge already exists")
            return false;
        }

        connector_list.push(info.connection);
        console.log(info.connection);

        adjList[fromIdx].push([toIdx, weight]);
        if (!directed_bool){
           adjList[toIdx].push([fromIdx, weight]);
        }
        return true;

    });




    //WICHTIG: stuff that adds to JSPLUMB canvas needs to be bound inside Jsplumb instance 



    var addButton = document.getElementById('newNodeBtn');
    instance.on(addButton, "click", function (e) {

        adjList.push([]);
        node_count++;

        var canvas = document.getElementById("canvas");
        var new_node = document.createElement('div');
        new_node.id = 'node' + node_count;
        new_node.className = 'node';
        new_node.style.left = left_offset + 'px';
        left_offset += 200;


        new_node.style.top = top_offset + 'px';
        if ((node_count + 1) % 3 == 0) {
            top_offset += 200;
            left_offset = 100
        };
        canvas.append(new_node);


        new_node.innerHTML = '<div class="flex-container">\
            <div class="flex-child node_info_parent"> \
                <div class="node_info">N'+ node_count + ' </div>   \
                <div class="node_info parent_info">  P:? </div>\
                <div class="node_info weight_info">  W:?  </div> \
            </div>\
            <div class="flex-child nodeSource"><div>\
            </div>';


        instance.addSourceSelector('.nodeSource');

        instance.addTargetSelector('.node');

        instance.manageAll('.node');




        //CONSOLE INPUT EDIT

        input = document.getElementById("console_input").value
        first_line = input.split('\n')[0]
        node_num = parseInt(first_line.split(' ')[0]) + 1
        edge_num = parseInt(first_line.split(' ')[1])

        document.getElementById("console_input").value = input.replace(first_line, node_num + " " + edge_num)

    })




    var loadGraphBtn = document.getElementById("load_graph_btn");
    instance.on(loadGraphBtn, "click", function (e) {
        
        algo = document.getElementById("algo").value
        if (algo.indexOf("undirected") == -1)
            directed_bool = true
        else
            directed_bool = false

        if (algo.indexOf("weighted") == -1)
            weighted_bool = false
        else
            weighted_bool = true

        input = document.getElementById('console_input').value;
        lines = input.split('\n');
        node_count_of_graph = parseInt(lines[0].split(' ')[0]);
        edge_count = lines[0].split(' ')[1];


        for (var j = 0; j < node_count_of_graph; j++) {

            //ALMOST THE SAME CODE AS ADD NEW NODE
            adjList.push([]);
            node_count++;

            var canvas = document.getElementById("canvas");
            var new_node = document.createElement('div');
            new_node.id = 'node' + node_count;
            new_node.className = 'node';
            new_node.style.left = left_offset + 'px';
            left_offset += 200;


            new_node.style.top = top_offset + 'px';

            if ((node_count + 1) % 3 == 0) {
                top_offset += 200;
                left_offset = 100
            };

            canvas.append(new_node);

            var btn = document.createElement('button');
            btn.innerHTML = 'Infect' + node_count;
            btn.id = 'btn' + node_count;
            btn.onclick = function (event) { infect(event.target.id); };



            new_node.innerHTML = '<div class="flex-container">\
                <div class="flex-child node_info_parent"> \
                    <div class="node_info"> N'+ node_count + ' </div>   \
                    <div class="node_info parent_info">  P:? </div>\
                    <div class="node_info weight_info">  W:?  </div> \
                </div>\
                <div class="flex-child nodeSource"><div>\
                </div>';

        };


        instance.addSourceSelector('.nodeSource', { endpoint: "Blank" });

        instance.addTargetSelector('.node', { endpoint: "Blank" });

        instance.manageAll('.node');



        for (var j = 1; j < lines.length; j++) {


            fromIdx = parseInt(lines[j].split(' ')[0]);
            toIdx = parseInt(lines[j].split(' ')[1]);
            weight = parseFloat(lines[j].split(' ')[2]);


            adjList[fromIdx].push([toIdx, weight]);
            if (!directed_bool){
                adjList[toIdx].push([fromIdx, weight]);
            }

            fromNode = document.getElementById('node' + fromIdx);
            toNode = document.getElementById('node' + toIdx);

            var conn = instance.connect({ source: fromNode, target: toNode, endpoint: "Blank" });
            connector_list.push(conn);
            console.log(conn);
        }

        instance.repaintEverything();

    });

    instance.setSuspendDrawing(false, true);

});
