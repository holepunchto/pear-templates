import React from 'react'

export const height = '44px'

const bar = {
  WebkitAppRegion: 'drag',
  position: 'fixed',
  inset: '0 0 auto 0',
  zIndex: 2,
  height,
  display: 'flex',
  alignItems: 'center',
  paddingInline: '12px',
  borderBottom: '1px solid rgba(255,255,255,0.2)'
}

export function TitleBar() {
  return (
    <div style={bar}>
      <pear-ctrl></pear-ctrl>
    </div>
  )
}
