const codeAreaDiv = document.querySelector("div.code-area");
let codeMirror;

/**
 * @param {string} lang
 * @param {string} defaultCode
 */
codeMirror = CodeMirror(codeAreaDiv, {
	mode: "python",
});
