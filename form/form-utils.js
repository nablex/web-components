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
		var keys = ["minLength", "maxLength", "pattern", "maxItems", "minItems", "maximum", "minimum", "exclusiveMaximum", "exclusiveMinimum", "enum"];
		for (var i = 0; i < keys.length; i++) {
			if (typeof(component[keys[i]]) != "undefined") {
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
		else if (required == null) {
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
	validateChildren: function(component) {
		var messages = [];
		for (var i = 0; i < component.$children.length; i++) {
			if (component.$children[i].validate) {
				var childMessages = component.$children[i].validate();
				if (component.$children[i].name) {
					for (var j = 0; j < childMessages.length; j++) {
						childMessages[j].context.push(component.$children[i].name);
					}
				}
				nabu.utils.arrays.merge(messages, childMessages);
			}
		}
		return messages;
	}
}