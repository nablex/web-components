Vue.component("n-form-richtext", {
	props: {
		value: {
			required: true
		}
	},
	template: "#n-form-richtext",
	data: function() {
		return {
			medium: null
		};
	},
	ready: function() {
		this.medium = new Medium({
			element: this.$refs.input,
			modifier: 'auto',
			placeholder: "",
			autofocus: false,
			autoHR: true,
			mode: Medium.richMode,
			maxLength: -1,
			modifiers: {
				'b': 'bold',
				'i': 'italicize',
				'u': 'underline',
				'v': 'paste'
			},
			tags: {
				'break': 'br',
				'horizontalRule': 'hr',
				'paragraph': 'p',
				'outerLevel': ['pre', 'blockquote', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'ul', 'table'],
				'innerLevel': ['a', 'b', 'u', 'i', 'img', 'strong', 'em', 'li', 'ul']
			},
			cssClasses: {
				editor: 'Medium',
				pasteHook: 'Medium-paste-hook',
				placeholder: 'Medium-placeholder',
				clear: 'Medium-clear'
			},
			attributes: {
				remove: ['style', 'class']
			},
			pasteAsText: true,
			beforeInvokeElement: function () {
				// this = Medium.Element
			},
			beforeInsertHtml: function () {
				// this = Medium.Html
			},
			beforeAddTag: function (tag, shouldFocus, isEditable, afterElement) {
			},
			keyContext: null,
			pasteEventHandler: function(e) {
				// default paste event handler
			}
		});
		if (this.value) {
			this.medium.value(this.value);
		}
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
			console.log("bolding...");
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
	},
	beforeDestroy: function() {
		this.medium.destroy();
	}
});