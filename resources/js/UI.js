const codeAreaDiv = document.querySelector("div.code-area");

let codeMirror = CodeMirror(codeAreaDiv, {
	value: "function myScript() {return 100; }\n",
	mode: "javascript",
});