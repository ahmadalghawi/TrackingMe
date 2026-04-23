import { useSettings } from '@/lib/i18n';
import type { Tweaks } from '@/lib/types';

interface Props {
  tweaks: Tweaks;
  setTweaks: (t: Tweaks) => void;
  onClose: () => void;
}

export default function TweaksPanel({ tweaks, setTweaks, onClose }: Props) {
  const { t } = useSettings();
  const update = <K extends keyof Tweaks>(key: K, val: Tweaks[K]) =>
    setTweaks({ ...tweaks, [key]: val });

  return (
    <div className="tweaks-panel">
      <h4>
        <span>{t('tw.title')}</span>
        <button className="close" onClick={onClose} aria-label="Close tweaks">×</button>
      </h4>

      <div className="tweak-row">
        <div className="tlbl">{t('tw.layout')}</div>
        <div className="seg">
          {([['fan', 'tw.layout.fan'], ['stack', 'tw.layout.stack'], ['grid', 'tw.layout.grid']] as const).map(([l, key]) => (
            <button key={l} className={tweaks.layout === l ? 'active' : ''} onClick={() => update('layout', l)}>
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <div className="tlbl">{t('tw.hue')} · {tweaks.accentHue}°</div>
        <input
          className="hue-slider"
          type="range"
          min={0}
          max={360}
          step={1}
          value={tweaks.accentHue}
          onChange={(e) => update('accentHue', parseInt(e.target.value))}
        />
      </div>

      <div className="tweak-row">
        <div className="tlbl">{t('tw.float')} · {tweaks.floatAmp}px</div>
        <input
          className="hue-slider"
          style={{ background: 'none' }}
          type="range"
          min={0}
          max={24}
          step={1}
          value={tweaks.floatAmp}
          onChange={(e) => update('floatAmp', parseInt(e.target.value))}
        />
      </div>

      <div className="tweak-row">
        <div className="tlbl">{t('tw.wordmark')}</div>
        <div className="seg">
          {([['split', 'tw.wordmark.split'], ['bold', 'tw.wordmark.bold'], ['outline', 'tw.wordmark.outline']] as const).map(([l, key]) => (
            <button key={l} className={tweaks.wordmark === l ? 'active' : ''} onClick={() => update('wordmark', l)}>
              {t(key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
