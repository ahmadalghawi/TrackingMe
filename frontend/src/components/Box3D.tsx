import './Box3DStyles.css';

interface Box3DProps {
  isOpen: boolean;
  isRipping: boolean;
  isHidden: boolean;
  onClick: () => void;
}

export default function Box3D({ isOpen, isRipping, isHidden, onClick }: Box3DProps) {
  return (
    <div
      className={[
        'box-wrap',
        isOpen ? 'is-open' : '',
        isRipping ? 'is-ripping' : '',
        isHidden ? 'is-hidden' : '',
      ].join(' ')}
      onClick={onClick}
      role="button"
      aria-label="Open delivery box to view your orders"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Bottom face */}
      <div className="box-face face-bottom cardboard" />

      {/* Interior (visible after flaps open) */}
      <div className="face-interior">
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'oklch(0.85 0.05 70 / 0.6)',
        }}>
          ↑ this side up ↑
        </div>
      </div>

      {/* Four side walls */}
      <div className="box-face face-front cardboard" />
      <div className="box-face face-back cardboard" />
      <div className="box-face face-left cardboard" />
      <div className="box-face face-right cardboard" />

      {/* Top flap — front (has address label, stamp, barcode) */}
      <div className="flap flap-front">
        <div className="flap-inner">
          <div className="flap-top-label">
            TRACKME<br />
            PRIORITY · 2-DAY
          </div>
          <div className="flap-stamp">
            FRAGILE<br />HANDLE<br />W/ CARE
          </div>
          <div className="flap-ship">
            TRACKME LOGISTICS<br />
            EXPRESS DELIVERY<br />
            ECO · CERTIFIED
          </div>
          <div className="flap-barcode" />
        </div>
        <div className="flap-under" />
      </div>

      {/* Back flap */}
      <div className="flap flap-back">
        <div className="flap-inner" style={{ opacity: 0.9 }} />
        <div className="flap-under" />
      </div>

      {/* Side flaps */}
      <div className="flap flap-left">
        <div className="flap-inner" style={{ opacity: 0.85 }} />
        <div className="flap-under" />
      </div>

      <div className="flap flap-right">
        <div className="flap-inner" style={{ opacity: 0.85 }} />
        <div className="flap-under" />
      </div>

      {/* Packing tape */}
      <div
        className="tape"
        style={{
          top: '-6px',
          height: '38%',
          transform: 'translateX(-50%) translateZ(121px)',
        }}
      >
        <div className="rip rip-top" />
        <div className="rip rip-bot" />
      </div>

      {/* Tape handle affordance */}
      <div
        className="tape-handle"
        style={{ top: '-10px', transform: 'translateX(-50%) translateZ(121px)' }}
      />
    </div>
  );
}
