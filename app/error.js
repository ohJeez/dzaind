"use client";

export default function Error() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#000',
      color: '#fff',
      textAlign: 'center',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div>
        <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>DZAIND</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', letterSpacing: '-0.08em', margin: '1rem 0' }}>Something broke.</h1>
        <a href="/" style={{ color: '#ff2a2a', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Reload the experience</a>
      </div>
    </main>
  );
}
