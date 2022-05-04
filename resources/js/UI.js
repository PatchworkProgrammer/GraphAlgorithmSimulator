const codeAreaDiv = document.querySelector("div.code-area");
let codeMirror;

/**
 * @param {string} lang
 * @param {string} defaultCode
 */


codeAreaDiv.replaceChildren();

codeMirror = CodeMirror(codeAreaDiv, {
	mode: "python",
});
