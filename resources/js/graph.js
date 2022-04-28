var node_count = 0;
var left_offset = 100;
var top_offset = 100;
var edges = [];
var adjList = [[]];
var edgesDiv = document.getElementById("edgeList");

runCode = async function () {
	code_input = "[" + document.getElementById("code_input").value + "]";
	console.log(code_input);
	response_data = fetch("https://emkc.org/api/v2/piston/execute", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			language: "python",
			version: "3.10.0",
			files: code_input,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			document.getElementById("console_output").innerHTML =
				data["run"]["stdout"];
		});
};

printAdjList = function () {
	console.log("called printAdjList");
	for (var i = 0; i < adjList.length; i++) {
		console.log(adjList[i]);
	}
};

updateEdges = function (conn, remove) {
	if (!remove) {
		edges.push(conn);

		//Getting weight by referring to adjList
		weight = -1;
		for (var i = 0; i < edges.length; i++) {
			if (edges[i] === conn) {
				fromIdx = parseInt(edges[i].sourceId.slice(4));
				toIdx = parseInt(edges[i].targetId.slice(4));

				for (var i = 0; i < adjList[fromIdx].length; i++) {
					if (adjList[fromIdx][i][0] == toIdx) {
						weight = adjList[fromIdx][i][1];
						break;
					}
				}

				break;
			}
		}

		conn.addOverlay({
			type: "Label",
			options: {
				label: weight,
				location: 0.7,
				cssClass: "custom_overlay",
			},
		});
	} else {
		var idx = -1;
		for (var i = 0; i < edges.length; i++) {
			if (edges[i] === conn) {
				idx = i;
				fromIdx = parseInt(edges[i].sourceId.slice(4));
				toIdx = parseInt(edges[i].targetId.slice(4));
				break;
			}
		}

		if (idx !== -1) {
			edges.splice(idx, 1);
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
	}

	var s =
		"<span> <strong>Edges</strong> </span> <br/> <br/> <table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
	for (var j = 0; j < edges.length; j++) {
		s =
			s +
			"<tr><td>" +
			edges[j].scope +
			"</td>" +
			"<td>" +
			edges[j].sourceId +
			"</td><td>" +
			edges[j].targetId +
			"</td></tr>";
	}
	edgesDiv.innerHTML = s;
	edgesDiv.style.display = "block";
};

loadGraph = function () {
	input = document.getElementById("graph_input").value;
	lines = input.split("/n");
	node_count = lines[0].split(" ")[0];
	edge_count = lines[0].split(" ")[1];

	newNodeBtn = document.getElementById("newNodeBtn");
	for (var j = 0; j < node_count; j++) {
		newNodeBtn.click();
	}
};
infect = function (id) {
	parent_node_id = document.getElementById(id).parentNode.id;

	to_infect = [];
	to_infect.push(parent_node_id);

	for (var j = 0; j < edges.length; j++) {
		if (edges[j].sourceId == parent_node_id) {
			to_infect.push(edges[j].targetId);
		}
	}

	for (var j = 0; j < to_infect.length; j++) {
		document.getElementById(to_infect[j]).classList.add("infected_node");
	}
};

jsPlumbBrowserUI.ready(function () {
	var instance = jsPlumbBrowserUI.newInstance({
		dragOptions: { cursor: "pointer", zIndex: 2000 },
		paintStyle: { stroke: "#666" },
		endpointHoverStyle: { fill: "red" },
		hoverPaintStyle: { stroke: "orange" },
		endpointStyle: { width: 20, height: 16, stroke: "#666" },
		dropOptions: { activeClass: "dragActive", hoverClass: "dropHover" },
		container: canvas,
	});

	var exampleDropOptions = {
		tolerance: "touch",
		hoverClass: "dropHover",
		activeClass: "dragActive",
	};

	var exampleColor = "#00f";
	var color2 = "#316b31";

	var exampleEndpoint = {
		endpoint: { type: "Dot", options: { radius: 11 } },
		paintStyle: { fill: color2 },
		source: true,
		reattach: true,
		scope: "directed",
		connectorStyle: { stroke: color2, strokeWidth: 6 },
		connector: { type: "StateMachine", options: {} },
		maxConnections: -1,
		target: true,
		dropOptions: exampleDropOptions,

		beforeDrop: function (params) {
			// console.log(params);
			fromIdx = parseInt(params.sourceId.slice(4));
			toIdx = parseInt(params.targetId.slice(4));
			weight = parseInt(document.getElementById("weightInput").value);

			adjList[fromIdx].push([toIdx, weight]);
			return true;
		},
	};
	var anchors = [[0.5, 0.5, 0, 0]];

	instance.setSuspendDrawing(true);

	instance.bind("connection", function (info, originalEvent) {
		//console.log(info);
		updateEdges(info.connection, false);
	});

	instance.bind("connection:click", function (connection, originalEvent) {
		instance.deleteConnection(connection);
		updateEdges(connection, true);
	});

	var addButton = document.getElementById("newNodeBtn");

	instance.on(addButton, "click", function (e) {
		adjList.push([]);
		node_count++;

		var canvas = document.getElementById("canvas");
		var new_node = document.createElement("div");
		new_node.id = "node" + node_count;
		new_node.className = "node";
		new_node.style.left = left_offset + "px";

		left_offset += 200;

		new_node.style.top = top_offset + "px";

		if (node_count % 3 == 0) {
			top_offset += 200;
			left_offset = 100;
		}

		canvas.append(new_node);

		instance.addEndpoint(
			new_node,
			{
				uuid: "endpoint" + node_count,
				anchor: anchors,
				connectorOverlays: [
					{ type: "PlainArrow", options: { location: 0.5 } },
				],
			},
			exampleEndpoint
		);

		var btn = document.createElement("button");
		btn.innerHTML = "Infect" + node_count;
		btn.id = "btn" + node_count;
		btn.onclick = function (event) {
			infect(event.target.id);
		};
		new_node.append(btn);
	});

	var loadGraphBtn = document.getElementById("load_graph_btn");

	instance.on(loadGraphBtn, "click", function (e) {
		input = document.getElementById("graph_input").value;
		lines = input.split("\n");
		node_count_of_graph = parseInt(lines[0].split(" ")[0]);
		edge_count = lines[0].split(" ")[1];

		for (var j = 0; j < node_count_of_graph; j++) {
			adjList.push([]);
			node_count++;

			var canvas = document.getElementById("canvas");
			var new_node = document.createElement("div");
			new_node.id = "node" + node_count;
			new_node.className = "node";
			new_node.style.left = left_offset + "px";
			left_offset += 200;

			new_node.style.top = top_offset + "px";

			if (node_count % 3 == 0) {
				top_offset += 200;
				left_offset = 100;
			}

			canvas.append(new_node);

			instance.addEndpoint(
				new_node,
				{
					uuid: "endpoint" + node_count,
					anchor: anchors,
					connectorOverlays: [
						{ type: "PlainArrow", options: { location: 0.5 } },
					],
				},
				exampleEndpoint
			);

			var btn = document.createElement("button");
			btn.innerHTML = "Infect" + node_count;
			btn.id = "btn" + node_count;
			btn.onclick = function (event) {
				infect(event.target.id);
			};
			new_node.append(btn);
		}

		for (var j = 1; j < lines.length; j++) {
			fromIdx = lines[j].split(" ")[0];
			toIdx = lines[j].split(" ")[1];
			weight = lines[j].split(" ")[2];

			adjList[fromIdx].push([toIdx, weight]);

			fromNode = document.getElementById("node" + fromIdx);
			toNode = document.getElementById("node" + toIdx);

			instance.connect({
				uuids: ["endpoint" + fromIdx, "endpoint" + toIdx],
			});
		}
	});

	instance.setSuspendDrawing(false, true);
});

/*
5 5
1 2 2
1 5 100
2 3 2
5 4 1
4 3 100
*/
