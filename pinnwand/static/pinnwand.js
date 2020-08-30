window.addEventListener("load", function(event) {
    var bar = document.querySelector("section.paste-submit");

    if(!bar) {
        return false;
    }

    var removes = document.querySelectorAll("a.remove");

    for(var i = 0; i < removes.length; i++) {
        var remove = removes[i];

        remove.addEventListener("click", function(event) {
            event.preventDefault();

            var section = event.target.parentNode.parentNode;

            document.querySelector("main.page-create").removeChild(section);
        });
    };

    var but = document.createElement("a");

    but.text = "Add another file.";
    but.className = "add";
    but.href = "#";

    but.addEventListener("click", function(event) {
        event.preventDefault();

        new_file_add();
    })

    bar.appendChild(but);

    /// textarea indent
    var textarea = document.querySelector('section.file-part textarea');
    textarea.onkeydown = make_indent;

});

function new_file_add() {
    var template = document.querySelector("section.file-template").cloneNode(true);
    template.className = "file-part file-extra";

    template.querySelector("a.remove").addEventListener("click", function(event) {
        event.preventDefault();

        var section = event.target.parentNode.parentNode;

        document.querySelector("main.page-create").removeChild(section);
    });

    document.querySelector("main.page-create").insertBefore(
        template,
        document.querySelector("section.paste-submit")
    );
}


function make_indent(event) {

	//var selector = document.querySelector("div.file-meta select[name='lexer']") // select the `select` under the file-meta div
	var selector = event.target.parentNode.parentNode.querySelector("select[name='lexer']") // select the `select` under the file-meta div
	var lexer = selector.options[selector.selectedIndex].text

	// only indenting for python at the moment
	if ( ! (lexer && lexer.toLowerCase().indexOf("python") == 0) ) {
		return
	}

	var keyCode = event.keyCode || event.which;
	if (keyCode == 9) { // check if a `tab` is pressed
		event.preventDefault();
		var start = this.selectionStart;
        var end = this.selectionEnd;
		var v = this.value;
		if (start == end) {
		    this.value = v.slice(0, start) + " ".repeat(4) + v.slice(start);
		    this.selectionStart = start + 4;
		    this.selectionEnd = start + 4;
		    return;
		}

		var selectedLines = [];
		var inSelection = false;
		var lineNumber = 0;
		for (var i = 0; i < v.length; i++) {
		    if (i == start) {
                inSelection = true;
                selectedLines.push(lineNumber);
		    }
		    if (i >= end)
                inSelection = false;

		    if (v[i] == "\n") {
			lineNumber++;
			if (inSelection)
			    selectedLines.push(lineNumber);
		    }
		}
		var lines = v.split("\n");
		for (var i = 0; i < selectedLines.length; i++)
		{
		    lines[selectedLines[i]] = " ".repeat(4) + lines[selectedLines[i]];
		}

		this.value = lines.join("\n");

		}
	else if (keyCode == 13) { // check if an `enter` is pressed
		event.preventDefault();

		var start = this.selectionStart;
		var end = this.selectionEnd;
        var v = this.value;
        var thisLine = "";
        var indentation = 1;
        for (var i = start-1; i >= 0 && v[i] != "\n"; i--) {
            thisLine = v[i] + thisLine;
        }
        for (var i = 0; i < thisLine.length && thisLine[i] == " "; i++) {
            indentation++;
        }
        this.value = v.slice(0, start) + "\n" + " ".repeat(indentation-1) + v.slice(start);
        this.selectionStart = start + indentation;
        this.selectionEnd = end + indentation;

	}
}
