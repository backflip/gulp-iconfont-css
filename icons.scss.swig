{% for glyph in glyphs %}
  .{{ glyph.filename }} {
    content: "\u{{ glyph.codepoint }}";
  }
{% endfor %}
