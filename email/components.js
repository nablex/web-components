Vue.component("e-root", {
	props: {
		inlineAll: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: "<!--mailroot--><table class=\"body\"><tr><td class=\"float-center\" align=\"center\" valign=\"top\"><center><slot></slot></center></td></tr></table><!--/mailroot-->",
	ready: function() {
		/*var link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/foundation-emails/2.2.1/foundation-emails.css");
		document.head.appendChild(link);*/
		
		//this.inlineCss();
		// apparently still edge cases where the timeout is necessary otherwise not everything gets inline...
		var self = this;
		setTimeout(function () {
			self.inlineCss();
		}, 100);
	},
	methods: {
		inlineCss: function() {
			// list of css properties is retrieved from the foundation css
			nabu.utils.elements.inlineCss(this.$el, true, this.inlineAll ? null : "email");
		}
	}
});

Vue.component("e-wrapper", {
	template: "<table class=\"wrapper\" align=\"center\"><tr><td class=\"wrapper-inner\"><slot></slot></td></tr></table>"
});

Vue.component("e-container", {
	template: "<table class=\"container\"><tbody><tr><td><slot></slot></td></tr></tbody></table>"
});

Vue.component("e-row", {
	template: "<table class=\"row\"><tbody><tr><slot></slot></tr></tbody></table>"
});

Vue.component("e-columns", {
	props: {
		small: {
			type: String,
			required: false
		},
		large: {
			type: String,
			required: false
		}
	},
	computed: {
		clazz: function() {
			var clazz = "";
			if (this.small) {
				clazz += " small-" + this.small;
			}
			if (this.large) {
				clazz += " large-" + this.large;
			}
			return clazz;
		}
	},
	template: "<th class=\"columns\" :class=\"clazz\"><table><tr><th><slot></slot></th><th class=\"expander\"></th></tr></table></th>"
});

Vue.component("e-button", {
	props: {
		href: {
			type: String,
			required: true
		}
	},
	template: "<table class=\"button\"><tr><td><table><tr><td><a :href=\"href\"><slot></slot></a></td></tr></table></td></tr></table>"
});

Vue.component("e-menu", {
	template: "<table class=\"menu\"><tr><td><table><tr><slot></slot></tr></table></td></tr></table>"
});

Vue.component("e-item", {
	props: {
		href: {
			type: String,
			required: true
		}
	},
	template: "<th class=\"menu-item\"><a :href=\"href\"><slot></slot></a></th>"
});

Vue.component("e-spacer", {
	template: "<table class=\"spacer\"><tbody><tr><td height=\"35px\" style=\"font-size:35px;line-height:35px;\">&#xA0;</td></tr></tbody></table>"
});

Vue.component("e-callout", {
	template: "<table class=\"callout\"><tr><th class=\"callout-inner\"><slot></slot></th><th class=\"expander\"></th></tr></table>"
});
