interface CoquillageProps {
  className?: string;
  title?: string;
  /** `full` = shell with outer arc + base (brand mark), `rays` = only the radiating branches */
  variant?: 'full' | 'rays';
  /** Rotation in degrees around the center. Default 0 (fan opens upward). 90 = opens rightward. */
  rotate?: number;
}

const RAY_ANGLES = [-42, -30, -18, -6, 6, 18, 30, 42];

const rayPath = (angle: number) => {
  const rad = (angle * Math.PI) / 180;
  const cx = 32 + Math.sin(rad) * 8;
  const cy = 54 - Math.cos(rad) * 8;
  const ex = 32 + Math.sin(rad) * 28;
  const ey = 54 - Math.cos(rad) * 34;
  return `M32 54 Q${cx.toFixed(2)} ${cy.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
};

/**
 * Stylized Saint-Jacques (Compostela) scallop shell — brand leitmotiv.
 * `variant="rays"` strips the outer arc and base for a minimalist line version.
 */
const Coquillage = ({
  className,
  title,
  variant = 'full',
  rotate = 0,
}: CoquillageProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role={title ? 'img' : 'presentation'}
    aria-label={title}
    aria-hidden={title ? undefined : true}
  >
    {title && <title>{title}</title>}
    <g
      transform={rotate ? `rotate(${rotate} 32 32)` : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {variant === 'full' && (
        <>
          <path
            d="M32 54 L26 48 Q32 50 38 48 Z"
            fill="currentColor"
            stroke="none"
          />
          <path
            d="M6 28
               Q10 14 24 8
               Q32 6 40 8
               Q54 14 58 28
               Q52 22 44 22
               Q38 22 32 26
               Q26 22 20 22
               Q12 22 6 28 Z"
          />
        </>
      )}
      {RAY_ANGLES.map((angle) => (
        <path key={angle} d={rayPath(angle)} />
      ))}
    </g>
  </svg>
);

export default Coquillage;
