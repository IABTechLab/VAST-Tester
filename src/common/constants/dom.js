export const VIDEO_ELEMENT_ID = 'video-slot'

export const SLOT_ELEMENT_ID = 'slot'

export const VPAID_IFRAME_ID = 'vpaid-iframe'

export const VPAID_IFRAME_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background: transparent;
}
#slot {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
</head>
<body>
<div id="${SLOT_ELEMENT_ID}"></div>
</body>
</html>`
