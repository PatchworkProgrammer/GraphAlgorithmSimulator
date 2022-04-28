var node_count = -1;
var left_offset = 100;
var top_offset = 100;
var adjList = [];

var src = 0;

// (node, parent, key/weight)

var graph_states =[
    [ [0, -1, 0.0], [1, -1, 10000], [2, -1, 10000], [3, -1, 10000], [4, -1, 10000],  ],
    [ [1, 0, 10.0], [4, -1, 10000], [2, -1, 10000], [3, -1, 10000],  ],
    [ [2, 0, 5.0], [4, -1, 10000], [1, 0, 10.0], [3, -1, 10000],  ],
    [ [1, 2, 8.0], [4, -1, 10000], [3, -1, 10000],  ],
    [ [4, 2, 7.0], [1, 2, 8.0], [3, -1, 10000],  ],
    [ [4, 2, 7.0], [1, 2, 8.0], [3, 2, 14.0],  ],
    [ [1, 2, 8.0], [3, 4, 13.0],  ],
    [ [1, 2, 8.0], [3, 4, 13.0],  ],
    [ [3, 4, 13.0], ],
    [ [3, 1, 9.0],  ],
    [  ],
    ]

var current_state = 0;

var edgeDiv = document.getElementById('edgeList')

runCode = async function() {
    code_input = "[" + document.getElementById('code_input').value + "]"
    console.log(code_input)
    response_data =
        fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                'language': 'python',
                'version': '3.10.0',
                'files': code_input
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById('console_output').innerHTML = data['run']['stdout']
        })


}

EdgeAlreadyExists = function(fromIdx,toIdx){

    for (var i = 0; i < adjList[fromIdx].length; i++) {
        if (adjList[fromIdx][i][0] == toIdx) {
            return true;
        }
    }
    return false;
}


printAdjList = function() {
    console.log("called printAdjList")
    for (var i = 0; i < adjList.length; i++) {
        console.log(adjList[i]);
    }

}

updateEdges = function(conn, remove) {

    
    fromIdx = parseInt(conn.sourceId.slice(4));
    toIdx = parseInt(conn.targetId.slice(4));

    if (!remove) {
      

        console.log(conn.sourceId, conn.targetId)

        //Getting weight by referring to adjList
        weight = -1;

        for (var i = 0; i < adjList[fromIdx].length; i++) {
            if (adjList[fromIdx][i][0] == toIdx) {
                weight = adjList[fromIdx][i][1];
                break;
            }
        }


        conn.addOverlay({
            type: "Label",
            options: { label: weight, location: 0.5, cssClass: 'custom_overlay' }
        });

        conn.addOverlay({ type: "PlainArrow", options: { width:10, length:25, location: 1 } });


    } else {
        
            
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

    }



    var s = "<span> <strong>Edges</strong> </span> <br/> <br/> \
            <table><tr><th>FROM</th><th>_TO_</th><th>WEIGHT</th></tr>";

    for (var j =1;j< adjList.length ;j++){
        for (var k = 0; k<adjList[j].length; k++){
            s = s + "<tr><td>   " + j + "</td>" + "<td>    " + adjList[j][k][0] + "</td><td>   " + adjList[j][k][1] + "</td></tr>";
        }
    }

    edgeDiv.innerHTML = s;
    edgeDiv.display = 'block';

};


updateGraphInfo = function(){

    var stillInQ = new Array(adjList.length).fill(false);
    
    for (var i=0; i < graph_states[current_state].length ;i++){
        node_id = 'node'+graph_states[current_state][i][0];
        
        
        stillInQ[graph_states[current_state][i][0]] = true;

        parent_id = graph_states[current_state][i][1];
        weight = graph_states[current_state][i][2];

        if (weight == 10000)
            weight = 'inf'
        node = document.getElementById(node_id);
        
       
        node.children[0].children[0].children[1].innerHTML = 'P:'+parent_id;
        node.children[0].children[0].children[2].innerHTML = 'W:'+weight;

   
    }

    for (var i=0; i < stillInQ.length ;i++){

        node = document.getElementById('node'+i);
        if (stillInQ[i]){
            console.log(i,' is still in queue');
            weight = node.children[0].children[0].children[2].innerHTML;
           

            if (weight.localeCompare('W:inf')!=0){
              
                node.classList.add('node_frontier');
            }
        }
        else{
            console.log(i,' is not in queue');
            node.classList.remove('node_frontier');
            node.classList.add('node_completed');
            
        }
    }




    if (current_state<=graph_states.length-1)
        current_state++;
    else
        alert("End of simulation");

}


loadGraph = function() {
    input = document.getElementById('graph_input').value;
    lines = input.split('/n');
    node_count = lines[0].split(' ')[0];
    edge_count = lines[0].split(' ')[1];

    newNodeBtn = document.getElementById('newNodeBtn');
    for (var j = 0; j < node_count; j++) {
        newNodeBtn.click();
    }

}
infect = function(id) {

    parent_node_id = document.getElementById(id).parentNode.id;

    to_infect = []
    to_infect.push(parent_node_id)

    for (var j = 0; j < edges.length; j++) {
        if (edges[j].sourceId == parent_node_id) {
            to_infect.push(edges[j].targetId);
        }
    }

    for (var j = 0; j < to_infect.length; j++) {
        document.getElementById(to_infect[j]).classList.add('infected_node');
    }





}


jsPlumbBrowserUI.ready(function() {

    var instance = window.j = jsPlumbBrowserUI.newInstance({
        dragOptions: { cursor: 'pointer', zIndex: 2000 },
        PaintStyle: {strokeStyle:'#0dd', lineWidth:2},
        endpointHoverStyle: { fill: "orange" },
        hoverPaintStyle: { stroke: "orange" },
        anchors: ["Continuous", "Continuous"],
        connector: {type:"Bezier", options:{ curviness: 23 } },
        dropOptions:{activeClass:"dragActive", hoverClass:"dropHover"},
        Endpoints : [  "Blank" ,  "Blank"  ],
        container: canvas
    });



 

  

    instance.setSuspendDrawing(true);

    instance.bind("connection", function(info, originalEvent) {
        updateEdges(info.connection, false);
    });


    instance.bind("connection:click", function(connection, originalEvent) {
        instance.deleteConnection(connection);
        updateEdges(connection, true);
    });


    //WICHTIG: USED TO INSERT THE WEIGHT FROM INPUT WHEN ADDING EDGES (MAY ADD POPUPS LATER)
    instance.bind("beforeDrop", function(params){
       
            fromIdx = parseInt(params.sourceId.slice(4));
            toIdx = parseInt(params.targetId.slice(4));
            weight = parseInt(document.getElementById('weightInput').value);

            console.log(fromIdx, toIdx, weight);

            if ( EdgeAlreadyExists(fromIdx,toIdx) )
                return false;
                
            adjList[fromIdx].push([toIdx, weight]);
            return true;

     });

    

    
    //WICHTIG: stuff that adds to JSPLUMB canvas needs to be bound inside Jsplumb instance 

    var addButton = document.getElementById('newNodeBtn');
    instance.on(addButton, "click", function(e) {

        adjList.push([]);
        node_count++;

        var canvas = document.getElementById("canvas");
        var new_node = document.createElement('div');
        new_node.id = 'node' + node_count;
        new_node.className = 'node';
        new_node.style.left = left_offset + 'px';
        left_offset += 200;


        new_node.style.top = top_offset + 'px';
        if (node_count % 3 == 0) {
            top_offset += 200;
            left_offset = 100
        };
        canvas.append(new_node);

        var btn = document.createElement('button');
        btn.innerHTML = 'Infect' + node_count;
        btn.id = 'btn' + node_count;
        btn.onclick = function(event) { infect(event.target.id); };
        

        new_node.innerHTML ='<div class="flex-container">\
            <div class="flex-child node_info_parent"> \
                <div class="node_info">'+node_count+' </div>   \
                <div class="node_info parent_info">  P:? </div>\
                <div class="node_info weight_info">  W:?  </div> \
            </div>\
            <div class="flex-child nodeSource"><div>\
            </div>';
        
        
        instance.addSourceSelector('.nodeSource');
        
        instance.addTargetSelector('.node');
           
        instance.manageAll('.node');
        
    })




    var loadGraphBtn = document.getElementById("load_graph_btn");
    instance.on(loadGraphBtn, "click", function(e) {


        input = document.getElementById('graph_input').value;
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

            if (node_count % 3 == 0) {
                top_offset += 200;
                left_offset = 100
            };

            canvas.append(new_node);

            var btn = document.createElement('button');
            btn.innerHTML = 'Infect' + node_count;
            btn.id = 'btn' + node_count;
            btn.onclick = function(event) { infect(event.target.id); };
            
          

            new_node.innerHTML ='<div class="flex-container">\
                <div class="flex-child node_info_parent"> \
                    <div class="node_info"> N'+node_count+' </div>   \
                    <div class="node_info parent_info">  P:? </div>\
                    <div class="node_info weight_info">  W:?  </div> \
                </div>\
                <div class="flex-child nodeSource"><div>\
                </div>';  
            
        };


        instance.addSourceSelector('.nodeSource',{ endpoint :"Blank"});
        
        instance.addTargetSelector('.node', { endpoint :"Blank"});
       
        instance.manageAll('.node');



        for (var j = 1; j < lines.length; j++) {


            fromIdx = lines[j].split(' ')[0];
            toIdx = lines[j].split(' ')[1];
            weight = lines[j].split(' ')[2];


            adjList[fromIdx].push([toIdx, weight]);

            fromNode = document.getElementById('node' + fromIdx);
            toNode = document.getElementById('node' + toIdx);



            
            // console.log(fromNode, toNode);
            instance.connect({source:fromNode, target:toNode, endpoint :"Blank" });

        }



    });

    instance.setSuspendDrawing(false, true);



});


