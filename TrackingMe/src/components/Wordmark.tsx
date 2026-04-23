import { useSettings } from '@/lib/i18n';
import type { WordmarkMode } from '@/lib/types';

export default function Wordmark({ style }: { style: WordmarkMode }) {
  const { t } = useSettings();
  const track = t('hero.wordmark.track');
  const me = t('hero.wordmark.me');

  if (style === 'bold') {
    return (
      <h1 className="wordmark" style={{ fontStyle: 'normal' }}>
        <span style={{ fontWeight: 800 }}>{track}{me}.</span>
      </h1>
    );
  }
  if (style === 'outline') {
    return (
      <h1
        className="wordmark"
        style={{
          color: 'transparent',
          WebkitTextStroke: '2px var(--ink)',
          fontWeight: 700,
        }}
      >
        {track}{me}
        <span style={{ color: 'var(--accent-deep)', WebkitTextStroke: 0 }}>.</span>
      </h1>
    );
  }
  return (
    <h1 className="wordmark">
      {track}
      <span className="me">{me}</span>.
    </h1>
  );
}
