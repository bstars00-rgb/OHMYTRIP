const STEPS = ['호텔 선택', '룸타입 선택', '여행자 확인', '결제하기'];

/** 원본 .page-step-header (01~04 진행 단계) 미러링 */
export default function PageStepHeader({
  activeStep,
  children,
}: {
  /** 1-base */
  activeStep: number;
  children: React.ReactNode;
}) {
  return (
    <article className="page-step-header">
      <div className="step-title">{children}</div>
      <div className="step-host">
        <ol className="page-step">
          {STEPS.map((label, i) => (
            <li key={label} className={i + 1 === activeStep ? 'active' : ''}>
              <strong className="num">{String(i + 1).padStart(2, '0')}</strong>
              <strong className="text">{label}</strong>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
