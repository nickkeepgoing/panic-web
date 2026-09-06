import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        padding: 4,
        width: '100%',
        height: '100%',
      }}
    >
      <div style={{ flex: 1, height: '43%', background: '#5B3FD6', borderRadius: 2 }} />
      <div style={{ flex: 1, height: '57%', background: '#0A7EA4', borderRadius: 2 }} />
      <div style={{ flex: 1, height: '75%', background: '#B35A00', borderRadius: 2 }} />
      <div style={{ flex: 1, height: '57%', background: '#0F7A55', borderRadius: 2 }} />
      <div style={{ flex: 1, height: '43%', background: '#A32E86', borderRadius: 2 }} />
    </div>,
    { ...size },
  );
}
