interface BoxProps {
  isOpen: boolean;
  isRipping: boolean;
  isPeeling: boolean;
  isCracking: boolean;
  isShaking: boolean;
  isHidden: boolean;
  onClick: () => void;
}

export default function Box3D({ isOpen, isRipping, isPeeling, isCracking, isShaking, isHidden, onClick }: BoxProps) {
  const className = [
    'box-wrap',
    isOpen && 'is-open',
    isRipping && 'is-ripping',
    isPeeling && 'is-peeling',
    isCracking && 'is-cracking',
    isShaking && 'is-shaking',
    isHidden && 'is-hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      onClick={onClick}
      role="button"
      aria-label="Open delivery box"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="face-bottom cardboard" />

      <div className="face-interior">
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'oklch(0.85 0.05 70 / 0.6)',
          }}
        >
          ↑ this side up ↑
        </div>
      </div>

      <div className="face face-front cardboard" />
      <div className="face face-back cardboard" />
      <div className="face face-left cardboard" />
      <div className="face face-right cardboard" />

      <div className="flap flap-front cardboard">
        <div className="flap-top-label">
          TRACKME
          <br />
          PRIORITY · 2-DAY
        </div>
        <div className="flap-stamp">
          FRAGILE
          <br />
          HANDLE
          <br />
          W/ CARE
        </div>
        <div className="flap-ship">
          TO: M. SULLIVAN
          <br />
          4418 VALENCIA ST
          <br />
          SF · CA · 94110
        </div>
        <div className="flap-barcode" />
      </div>

      <div className="flap flap-back cardboard" />
      <div className="flap flap-left cardboard" />
      <div className="flap flap-right cardboard" />

      <div className="tape" />
      <div className="tape-handle" />
    </div>
  );
}
