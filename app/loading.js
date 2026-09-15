export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#000',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      letterSpacing: '-0.08em',
      textTransform: 'uppercase',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: 700 }}>DZAIND</div>
      </div>
    </div>
  );
}
