if (!nabu) { var nabu = {}; }
if (!nabu.utils) { nabu.utils = {}; }
if (!nabu.utils.vue) { nabu.utils.vue = {}; }

nabu.utils.vue.form = {
	definition: function(component) {
		// take the original schema (if any)
		var schema = component.schema ? nabu.utils.objects.clone(component.schema) : null;
		// check if we can find the definition in the parent component
		if (!schema && component.name && component.$parent && component.$parent.definition && component.$parent.definition.properties) {
			schema = component.$parent.definition.properties[component.name];
		}
		if (!schema) {
			schema = {};
		}
		// bind in the additional keys
		var keys = ["minLength", "maxLength", "pattern", "patternComment", "maxItems", "minItems", "maximum", "minimum", "exclusiveMaximum", "exclusiveMinimum", "enum"];
		for (var i = 0; i < keys.length; i++) {
			if (component[keys[i]] != null) {
				schema[keys[i]] = component[keys[i]];
			}
		}
		return schema;
	},
	mandatory: function(component) {
		var required = component.required;
		if (required == null && component.name && component.$parent && component.$parent.definition) {
			required = component.$parent.definition.required && component.$parent.definition.required.indexOf(component.name) >= 0;
		}
		if (required == null && component.definition && component.definition.required) {
			required = true;
		}
		if (required == null) {
			required = false;
		}
		return required;
	},
	labels: function(component) {
		var labels = [];
		if (component.$children) {
			for (var i = 0; i < component.$children.length; i++) {
				if (component.$children[i].label) {
					labels.push(component.$children[i].label);
				}
			}
			// if there were no labels, ask the children
			if (!labels.length) {
				for (var i = 0; i < component.$children.length; i++) {
					if (component.$children[i].labels) {
						nabu.utils.arrays.merge(labels, component.$children[i].labels);
					}
					if (labels.length) {
						break;
					}
				}
			}
		}
		return labels.length ? labels : null;
	},
	mode: function(component) {
		while (component) {
			if (component.mode) {
				return component.mode;
			}
			component = component.$parent;
		}
		return null;
	},
	localMessages: function(component, messages) {
		var localMessages = [];
		if (!messages || !messages.length) {
			return localMessages;
		}
		var mode = nabu.utils.vue.form.mode(component);
		messages.sort(function(a, b) {
			var priorityA = typeof(a.priority) != "undefined" ? a.priority : 0;
			var priorityB = typeof(b.priority) != "undefined" ? b.priority : 0;
			return priorityA - priorityB;
		});
		var handled = false;
		if (mode == "component") {
			localMessages.push(messages[0]);
			handled = true;
		}
		else if (component.mode != null) {
			var amount = parseInt(component.mode);
			if (amount == 0) {
				amount = messages.length;
			}
			else {
				amount = Math.min(amount, messages.length);
			}
			nabu.utils.arrays.merge(localMessages, messages.slice(0, amount));
			handled = true;
		}
		if (handled == true) {
			messages.forEach(function(x) { x.handled = true });
		}
		return localMessages;
	},
	validateChildren: function(component, soft) {
		var wrap = function(promise) {
			var newPromise = new nabu.utils.promise();
			promise.then(newPromise, newPromise);
			return newPromise;
		};
		var messages = nabu.utils.schema.addAsyncValidation([]);
		for (var i = 0; i < component.$children.length; i++) {
			if (component.$children[i].validate) {
				var childMessages = component.$children[i].validate(soft);
				if (component.$children[i].name) {
					for (var j = 0; j < childMessages.length; j++) {
						childMessages[j].context.push(component.$children[i].name);
					}
				}
				nabu.utils.arrays.merge(messages, childMessages);
				if (childMessages && childMessages.then) {
					messages.defer(wrap(childMessages));
				}
			}
			// recurse over non-form components, they might be structural and secretly contain other form elements
			else {
				var childMessages = nabu.utils.vue.form.validateChildren(component.$children[i], soft);
				nabu.utils.arrays.merge(messages, childMessages);
				if (childMessages && childMessages.then) {
					messages.defer(wrap(childMessages));
				}
			}
		}
		return messages;
	}
}
