const runCodeButton = document.getElementById("run-code");
const langSelection = document.getElementById("language");

const pyVersion = "3.10.0";
const cppVersion = "10.2.0";
const javaVersion = "15.0.2";

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
			}
		});
});
