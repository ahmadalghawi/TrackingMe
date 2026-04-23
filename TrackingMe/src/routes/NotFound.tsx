import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center font-sans">
      <div className="text-center">
        <div className="font-mono text-xs uppercase tracking-[0.12em] text-ink-soft mb-2">404</div>
        <h1 className="text-4xl font-bold text-ink mb-4">Package not found</h1>
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.12em] underline">
          ← back to tracking
        </Link>
      </div>
    </div>
  );
}
