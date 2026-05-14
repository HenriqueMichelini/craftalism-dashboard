import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ModalShell } from "../../src/components/ui/ModalShell.js";

test("ModalShell renders an accessible dialog with dimmed blurred backdrop", () => {
  const markup = renderToStaticMarkup(
    <ModalShell
      title="Create Player"
      onClose={() => {}}
      footer={<button type="button">Cancel</button>}
    >
      <p>Modal content</p>
    </ModalShell>,
  );

  assert.match(markup, /role="dialog"/);
  assert.match(markup, /aria-modal="true"/);
  assert.match(markup, /Create Player/);
  assert.match(markup, /bg-black\/50/);
  assert.match(markup, /backdrop-blur-sm/);
  assert.match(markup, /Close modal/);
  assert.match(markup, /Cancel/);
});
