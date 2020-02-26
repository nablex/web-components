Vue.component("n-form-richtext", {
	props: {
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
		},
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		name: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		pattern: {
			type: String,
			required: false
		},
		minLength: {
			type: Number,
			required: false
		},
		maxLength: {
			type: Number,
			required: false
		},
		timeout: {
			type: Number,
			required: false
		},
		cleanStyle: {
			type: Boolean,
			required: false
		},
		info: {
			type: String,
			required: false
		},
		suffix: {
			type: String,
			required: false
		},
		before: {
			type: String,
			required: false
		},
		after: {
			type: String,
			required: false
		}
	},
	template: "#n-form-richtext",
	data: function() {
		return {
			messages: [],
			valid: null,
			showBlock: false,
			showJustify: false,
			showDecoration: false,
			color: "#000000",
			focused: false
		};
	},
	computed: {
		definition: function() {
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		update: function($event) {
			var content = $event.target.innerHTML;
			this.$emit("change", content);
			if (this.timer != null) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			if (this.timeout) {
				var self = this;
				var self = this;
				this.timer = setTimeout(function() {
					self.$emit("input", content);
				}, this.timeout);
			}
			else {
				this.$emit("input", content);
			}
		},
		justify: function(direction) {
			document.execCommand(direction, false, null)
		},
		insertTable: function() {
			document.execCommand("insertHTML", null, "<table cellspacing='0' cellpadding='0'><tr><td>" + window.getSelection() + "</td></tr></table>");
		},
		list: function() {
			document.execCommand("insertHTML", null, "<ul><li>" + window.getSelection() + "</li></ul>");
		},
		wrap: function(tag) {
			document.execCommand("insertHTML", null, "<" + tag + ">" + window.getSelection() + "</" + tag + ">");
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
				//document.execCommand("createLink", false, link);
				document.execCommand("insertHTML", false, "<a target='_blank' href='" + link + "' rel='noreferer noopener nofollow'>" + window.getSelection() + "</a>");
			}
		},
		paste: function(event) {
			var self = this;
			for (var i = 0; i < event.clipboardData.items.length; i++) {
				if (event.clipboardData.items[i].type.toLowerCase().match(/text\/.*/)) {
					event.clipboardData.items[i].getAsString(function(content) {
						var cleaned = nabu.utils.elements.clean(
							content,
							["p", "strong", "h1", "h2", "h3", "h4", "h5", "h6", "h7", "strong", "em", "b", "i", "u", "ul", "ol", "li", "br", "span", "div"],
							["head", "script", "style", "meta", "font"],
							null,
							self.cleanStyle ? ["style"] : null);
						document.execCommand("insertHTML", null, cleaned);
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
		},
		validate: function() {
			var messages = nabu.utils.schema.json.validate(this.definition, this.value ? this.value.replace(/<[^>]+>/, "") : this.value, this.mandatory);
			for (var i = 0; i < messages.length; i++) {
				Object.defineProperty(messages[i], 'component', {
					value: this,
					enumerable: false
				});
			}
			this.valid = messages.length == 0;
			return messages;
		},
		applyColor: function() {
			document.execCommand("insertHTML", null, "<span style='color:" + this.color + "'>" + window.getSelection() + "</span>");
		}
	}
});

Vue.directive("html-once", {
	bind: function(element, binding) {
		element.innerHTML = binding.value;
	}
});

