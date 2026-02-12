/*
 * Copyright (c) Daniel Ellermann
 */

import { Plugin } from "obsidian";
import {AnsiUp} from "ansi_up";

export default class CodePlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("console", (source, el, ctx) => {
      const lines = source.split("\n");
      const ansiUp = new AnsiUp();
      ansiUp.use_classes = true;

      const pre = el.createEl("pre", { cls: "language-console" });
      for (const line of lines) {
        const m = line.match(/^\s*([>#%\$])\s+(.+)$/);
        if (m != null) {
          const div = pre.createEl("div");
          div.createEl(
            "span",
            {
              text: m[1],
              cls: "console-prompt" +
                (m[1] === "#" ? " console-prompt-root" : "")
            }
          );
          // Parse ANSI codes in commands too
          const cmdSpan = div.createEl("span", { cls: "console-command" });
          cmdSpan.innerHTML = ansiUp.ansi_to_html(m[2]);
        } else {
          // Parse ANSI escape sequences in output lines
          const div = pre.createEl("div", { cls: "console-output" });
          div.innerHTML = ansiUp.ansi_to_html(line);
        }
      }
    });
  }
}
