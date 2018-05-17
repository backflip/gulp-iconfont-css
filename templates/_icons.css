@font-face {
	font-family: "<%= fontName %>";
	src: url('<%= fontPath %><%= fontName %>.eot<%= cacheBusterQueryString %>');
	src: url('<%= fontPath %><%= fontName %>.eot?<%= cacheBuster %>#iefix') format('eot'),
		url('<%= fontPath %><%= fontName %>.woff2<%= cacheBusterQueryString %>') format('woff2'),
		url('<%= fontPath %><%= fontName %>.woff<%= cacheBusterQueryString %>') format('woff'),
		url('<%= fontPath %><%= fontName %>.ttf<%= cacheBusterQueryString %>') format('truetype'),
		url('<%= fontPath %><%= fontName %>.svg<%= cacheBusterQueryString %>#<%= fontName %>') format('svg');
}

.<%= cssClass %>:before {
	font-family: "<%= fontName %>";
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	font-style: normal;
	font-variant: normal;
	font-weight: normal;
	/* speak: none; only necessary if not using the private unicode range (firstGlyph option) */
	text-decoration: none;
	text-transform: none;
}

<% _.each(glyphs, function(glyph) { %>
.<%= cssClass %>-<%= glyph.fileName %>:before {
	content: "\<%= glyph.codePoint %>";
}
<% }); %>
