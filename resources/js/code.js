const runCodeButton = document.getElementById("run-code");
const langSelection = document.getElementById("language");

const pyVersion = "3.10.0";
const cppVersion = "10.2.0";
const javaVersion = "15.0.2";

default_code =`
import java.util.ArrayList;
import java.util.Scanner;

public class SampleDijkstra {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int vertices = scanner.nextInt();
        myAdjList list = new myAdjList(vertices, true);

        int edges = scanner.nextInt();

        for (int i = 0; i < edges; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            double w = scanner.nextDouble();
            list.addEdges(u, v, w);
        }

        int source = scanner.nextInt();
        int destination = scanner.nextInt();
        var solution = Dijkstra.Dijkstra_Algo(list, source, destination);
    }
}


class vertexClass {
    private int value, parent, indexInHeap;
    private double key;


    public vertexClass(int value, double key, int parent) {
        this.key = key;
        this.value = value;
        this.parent = parent;
        this.indexInHeap = -1;

    }

    public void setIndexInHeap(int indexInHeap) {
        this.indexInHeap = indexInHeap;
    }

    public int getIndexInHeap() {
        return indexInHeap;
    }

    public vertexClass(vertexClass o) {
        this.key = o.key;
        this.value = o.value;
        this.parent = o.parent;
        this.indexInHeap = o.indexInHeap;
    }

    public double getKey() {
        return key;
    }

    public void setKey(double key) {
        this.key = key;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public int getParent() {
        return parent;
    }

    public void setParent(int parent) {
        this.parent = parent;
    }

    @Override
    public String toString() {
        return "[" +
                value +
                "," + parent +
                "," + key +
                "]";
    }

    public String uvw() {
        return "(" + parent +
                "," + value +
                "," + key +
                ")";
    }

    public String vertex_bracket_format_print() {
        return "(" + value +
                "," + parent +
                ")";
    }
}

class MinBinHeap {
    vertexClass[] arr;
    int size;
    int top;
    int start = 1;

    public MinBinHeap(vertexClass[] arr) {
        //MINHEAP FROM AN ARR STARTING FROM 0
        this.arr = new vertexClass[arr.length + 1];

        for (int i = 0; i < arr.length; i++) {
            this.arr[i + 1] = arr[i];
            this.arr[i + 1].setIndexInHeap(i + 1);
        }

        size = arr.length;
        top = size + 1;

        buildHeap();
    }

    void buildHeap() {
        for (int i = size / 2; i >= start; i--) {
            min_heapify(i);
        }
    }

    public MinBinHeap(int n) {
        top = 1;
        arr = new vertexClass[n + 1];
        size = n;
    }

    void insert(vertexClass n) {
        if (top > size) {
            System.out.println("Overflow");
            return;
        }
        if (top == 1) {
            arr[top] = n;
            top++;
            return;
        }
        arr[top] = n;
        percolate_up(top);
        top++;


    }

    void percolate_up(int i) {
        if (i == start)
            return;

        int parent = parent(i);
        if (arr[i].getKey() < arr[parent].getKey()) {
            swap(parent, i);
            percolate_up(parent);
        }
    }

    int parent(int i) {
        return i / 2;
    }


    int left(int i) {
        return i * 2;
    }

    int right(int i) {
        return i * 2 + 1;
    }

    void min_heapify(int i) {

        int left = left(i);
        int right = right(i);

        int smallest = i;
        if (left <= size && arr[left].getKey() < arr[smallest].getKey()) {
            smallest = left;
        }

        if (right <= size && arr[right].getKey() < arr[smallest].getKey()) {
            smallest = right;
        }
        //System.out.println(arr[largest]);

        if (smallest != i) {
            swap(i, smallest);
            min_heapify(smallest);
        }

    }

    void swap(int i, int j) {

        int idx_of_i = arr[i].getIndexInHeap();
        int idx_of_j = arr[j].getIndexInHeap();

        vertexClass temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        arr[i].setIndexInHeap(idx_of_i);
        arr[j].setIndexInHeap(idx_of_j);

    }


    vertexClass getMax() {
        return arr[1];
    }

    boolean isEmpty() {
        return size == 0;
    }

    vertexClass extractMin() {
        if (isEmpty()) {
            System.out.println("Underflow.");
            return null;
        }
        vertexClass temp = new vertexClass(arr[start]);
        temp.setIndexInHeap(-1);
        arr[start] = arr[top - 1];
        arr[start].setIndexInHeap(start);

        top--;
        size--;

        min_heapify(start);

        return temp;


    }

    void decrease_min(int v, double w) {
        //V is the
        arr[v].setKey(w);
        percolate_up(v);
    }

    void heapsort() {

        while (size > 0) {
            System.out.println(extractMin());
        }

    }


    public void print() {
        System.out.print("[");
        for (int i = 1; i < top; i++) {
            System.out.print(arr[i]);
            if (i != top - 1)
                System.out.print(",");

        }
        System.out.print("]");

    }
}

class Node {
    private final int index;
    private final double weight;
    private Node next;

    public Node(int index, double weight) {
        this.index = index;
        this.weight = weight;
    }

    public Node getNext() {
        return next;
    }

    public void setNext(Node next) {
        this.next = next;
    }

    public int getIndex() {
        return index;
    }

    public double getWeight() {
        return weight;
    }

    @Override
    public String toString() {
        return " (" + index + "," + weight + ") ";
    }


}

class myLinkedList {
    private final Node head;
    private Node tail;
    private int count;

    public myLinkedList(Node head) {
        this.head = head;
        this.tail = head;
        count = 1;
    }

    public Node[] return_as_array() {

        Node[] arr = new Node[count];
        int i = 0;
        Node current = head;
        while (current != null) {
            arr[i++] = current;
            current = current.getNext();
        }
        return arr;
    }

    public void add(Node e) {
        tail.setNext(e);
        tail = e;
        count++;
    }


    public Node getHead() {
        return head;
    }

    @Override
    public String toString() {
        StringBuilder temp = new StringBuilder();
        Node current = head;
        while (current != null) {
            temp.append(current.toString());
            current = current.getNext();
        }
        return temp.toString();
    }
}

class edgeObject {
    private final int u, v;
    private final double weight;

    public edgeObject(int u, int v, double weight) {
        this.u = u;
        this.v = v;
        this.weight = weight;
    }

    public int getU() {
        return u;
    }

    public int getV() {
        return v;
    }

    public double getWeight() {
        return weight;
    }

    @Override

    public String toString() {
        return
                "( " + u +
                        "," + v +
                        ",  " + weight +
                        ")";
    }

    public String vertex_bracket_format_print() {
        return "(" + u +
                "," + v +
                ")";
    }
}

class myAdjList {
    private final myLinkedList[] adjList;

    private final boolean directed;

    myAdjList(int vertices, boolean directed) {

        this.directed = directed;
        adjList = new myLinkedList[vertices];
        for (int i = 0; i < vertices; i++) {
            adjList[i] = new myLinkedList(new Node(i, -1));
        }


    }

    public void addEdges(int u, int v, double weight) {
        adjList[u].add(new Node(v, weight));
        if (!directed) {
            adjList[v].add(new Node(u, weight));
        }
    }

    public myLinkedList getAdjVerticesOf(int u) {
        return adjList[u];
    }

    public void print_adjList() {

        for (myLinkedList myLinkedList : adjList) {
            System.out.println(myLinkedList);
        }

    }

    public int get_vertex_number() {
        return adjList.length;
    }


    public static myAdjList transpose(myAdjList list) {
        int vertices = list.get_vertex_number();

        myAdjList transposed = new myAdjList(vertices, true);

        for (int i = 0; i < vertices; i++) {

            Node[] adjListArr = list.getAdjVerticesOf(i).return_as_array();
            for (int j = 1; j < adjListArr.length; j++) {
                transposed.addEdges(adjListArr[j].getIndex(), i, adjListArr[j].getWeight());
            }
        }
        return transposed;
    }
}

class Dijkstra {
    private static final double INFINITY = 10000;
    private static final int NULL = -1;


    public static vertexClass[] initialize_single_src(myAdjList list, int source) {
        int vertices_num = list.get_vertex_number();
        vertexClass[] vertices_arr = new vertexClass[vertices_num];

        for (int i = 0; i < vertices_num; i++) {
            if (i == source) {
                vertices_arr[i] = new vertexClass(i, 0, NULL);
            } else {
                vertices_arr[i] = new vertexClass(i, INFINITY, NULL);
            }
        }
        return vertices_arr;
    }

    private static void Relax(vertexClass U, int v, double w, vertexClass[] vertices_arr, MinBinHeap Q) {

        if ((w + U.getKey()) < vertices_arr[v].getKey()) {
            vertices_arr[v].setParent(U.getValue());
            Q.decrease_min(vertices_arr[v].getIndexInHeap(), w + U.getKey());

        }
    }

    public static ArrayList<vertexClass> Dijkstra_Algo(myAdjList list, int source, int dest) {

        vertexClass[] vertices_arr = initialize_single_src(list, source);

        MinBinHeap Q = new MinBinHeap(vertices_arr);

        System.out.print("[");
        Q.print();
        System.out.print(",");

        while (!Q.isEmpty()) {

            vertexClass U = Q.extractMin();
//            System.out.println("from Q got "+ u + " from " + temp.getParent()+ " with key "+temp.getKey());

            Node[] adj_of_u = list.getAdjVerticesOf(U.getValue()).return_as_array();

            for (int i = 1; i < adj_of_u.length; i++) {

                double w = adj_of_u[i].getWeight();
                int v = adj_of_u[i].getIndex();

                Relax(U, v, w, vertices_arr, Q);

                Q.print();
                System.out.print(",");

            }


        }
        System.out.print("[]]");
        System.out.println();

        ArrayList<vertexClass> solution = new ArrayList<>();

        if (vertices_arr[dest].getKey() == INFINITY) {
            System.out.println("No way to reach " + dest + " from " + source);
            return solution;
        }
        System.out.println("Shortest path cost: " + vertices_arr[dest].getKey());
        printPath(source, dest, vertices_arr);
        System.out.println();


        for (vertexClass vertex : vertices_arr) {
            if (vertex.getParent() != NULL)
                solution.add(vertex);

        }
        return solution;


    }

    private static void printPath(int source, int node, vertexClass[] vertex_arr) {


        if (node == source) {
            System.out.print(node);
            return;
        }

        printPath(source, vertex_arr[node].getParent(), vertex_arr);
        System.out.print(" -> " + node);
    }


}
`

const codeInputArea = document.querySelector(".code-input textarea");
const codeOutputArea = document.querySelector(".code-output textarea");


langSelection.addEventListener("change", (event) => {
	let changedLang = event.target.value;
	console.log(changedLang);
	const codeMirrorElem = document.querySelector(".CodeMirror");
	if (changedLang === "python") {
		codeMirror.setOption("mode", "python");
	} else if (changedLang == "c++") {
		codeMirror.setOption("mode", "text/x-c++src");
	} else {
		codeMirror.setOption("mode", "text/x-java");
		
		codeMirror.setValue(default_code);
	}
});

runCodeButton.addEventListener("click", (event) => {

	
	const code = codeMirror.getValue();
	const lang = document.getElementById("language").value;
	let version;

	if (lang === "python") {
		version = pyVersion;
	} else if (lang === "c++") {
		version = cppVersion;
	} else {
		version = javaVersion;
	}

	const consoleInput = codeInputArea.value;

	fetch("https://emkc.org/api/v2/piston/execute", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			language: lang,
			version: version,
			files: [
				{
					content: code,
				},
			],
			stdin: consoleInput,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.language == "c++" && data.compile.stderr) {
				// cpp error in compilation
				codeOutputArea.value = data.compile.stderr;
			} else {
				codeOutputArea.value = data.run.output;
				

				//ADDED THIS SAMEEN
				graph_states = JSON.parse(codeOutputArea.value.split('\n')[0])
			}
		});
});


