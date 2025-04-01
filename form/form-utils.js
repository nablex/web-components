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
	rewriteCodes: function(messages, codes) {
		if (codes instanceof Array) {
			var result = {};
			codes.forEach(function(x) {
				if (x.code) {
					result[x.code] = x;
				}
			});
			codes = result;
		}
		if (messages && messages.length && codes) {
			messages.forEach(function(x) {
				if (x.code) {
					// suppose you have a code "required" on a field "sessionSchedule[0].start"
					// by default we will translate the code "required" into "must exist" or something
					// however, in some cases you may want to have a more specific code for the start or for everything in sessionschedule
					// in that case, we use the context which is reverse sorted, so it would be "start, 0, sessionSchedule" in this example
					// we want to check for "sessionSchedule.start.required", then "sessionSchedule.required", only then "required"
					var codeToUse = null;
					if (x.context instanceof Array) {
						var contextToCheck = "";
						for (var i = x.context.length - 1; i >= 0; i--) {
							// cast to string and see if it is a number
							if (("" + x.context[i]).match(/^[0-9]+$/)) {
								continue;
							}
							if (contextToCheck != "") {
								contextToCheck += ".";
							}
							contextToCheck += x.context[i];
							// we only make it more specific as we go, so if get more specific matches, we use it
							if (codes[contextToCheck + "." + x.code]) {
								codeToUse = codes[contextToCheck + "." + x.code];
							}
						}
					}
					if (codeToUse == null) {
						codeToUse = codes[x.code];
					}
					if (codeToUse) {
						if (typeof(codeToUse) == "string") {
							x.title = codeToUse;
							x.title = nabu.utils.vue.form.replaceVariables(x.title, x);
						}
						else {
							Object.keys(codeToUse).forEach(function(key) {
								x[key] = codeToUse[key];
								x[key] = nabu.utils.vue.form.replaceVariables(x[key], x);
							});
						}
					}
				}
			});
		}
	},
	replaceVariables: function(template, variables) {
		if (variables) {
			Object.keys(variables).forEach(function(x) {
				template = template.replace(new RegExp("\\{[\\s]*" + x + "[\\s]*\\}", "g"), variables[x]);
			});
		}
		return template;
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
		// base it on html elements rather than $parent chains
		// the $parent chains are not always to be trusted to get to the right component
		var element = component.$el;
		while (element && element.getAttribute) {
			if (element.getAttribute("mode")) {
				return element.getAttribute("mode");
			}
			element = element.parentNode;
		}
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
						if (childMessages[j].context instanceof Array) {
							childMessages[j].context.push(component.$children[i].name);
						}
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
	},
	validateCustom: function(messages, valueToValidate, validator, context) {
		// allow for custom validation
		if (validator != null) {
			var additional = validator(valueToValidate);
			// we can send back asynchronous validations
			if (additional != null && additional.then) {
				messages.defer(additional);
			}
			// or an array of validations
			else if (additional != null && additional.length) {
				for (var i = 0; i < additional.length; i++) {
					Object.defineProperty(additional[i], 'component', {
						value: context,
						enumerable: false
					});
					if (typeof(additional[i].context) == "undefined") {
						additional[i].context = [];
					}
					messages.push(additional[i]);
				}
			}
		}
		return messages;
	}
}

