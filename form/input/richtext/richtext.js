Vue.component("n-form-richtext", {
	props: {
		value: {
			required: true
		}
	},
	template: "#n-form-richtext",
	data: function() {
		return {
		};
	},
	methods: {
		insertTable: function() {
			document.execCommand("insertHTML", null, "<table cellspacing='0' cellpadding='0'><tr><td>" + window.getSelection() + "</td></tr></table>");
		},
		list: function() {
			document.execCommand("insertHTML", null, "<ul><li>" + window.getSelection() + "</li></ul>");
		},
		wrap: function(tag) {
			document.execCommand("insertHTML", null, "<" + tag + ">" + window.getSelection() + "</" + tag+ ">");
		},
		bold: function() {
			document.execCommand("bold", false, null);
		},
		italic: function() {
			document.execCommand("italic", false, null);
		},
		underline: function() {
			document.execCommand("underline", false, null);
		},
		link: function() {
			var link = prompt("Link");
			if (link) {
				document.execCommand("createLink", false, link);
			}
		},
		paste: function(event) {
			for (var i = 0; i < event.clipboardData.items.length; i++) {
				if (event.clipboardData.items[i].type.toLowerCase() == "text/html") {
					event.clipboardData.items[i].getAsString(function(content) {
						console.log("pre-strip", content);
						document.execCommand("insertHTML", null, nabu.utils.elements.clean(
							content,
							["p", "strong", "h1", "h2", "h3", "h4", "h5", "h6", "h7", "strong", "em", "b", "i", "u", "ul", "ol", "li", "br"],
							["head", "script", "style", "meta"]));
					});
					break;
				}
			}
			event.preventDefault();
		},
		tab: function(event) {
			document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
			event.preventDefault();
		},
		indent: function() {
			document.execCommand("indent", false, null);
		},
		outdent: function() {
			document.execCommand("outdent", false, null);
		},
		clean: function() {
			document.execCommand("removeFormat", false, null);
		}
	}
});