import { useGlobalContext } from "../context/global-context";

export default function Stepper ({step, label, target, children}) {
    const {setStep} = useGlobalContext();

    const div_styles = {backgroundColor: step === target ? 'var(--primary-text-accent)' : 'transparent'};
    const h1_styles = {color: step === target ? 'var(--primary-text-color)' : '#bfbcc4', fontSize: step === target ? '1.8em' : '1.2em'};
    const p_styles = {color: step === target ? 'var(--primary-text-accent)' : '#bfbcc4'};
    const span_styles = 
        (target === 0) ? { height: step === 0 && 442} : 
        (target === 1) ? { height: step === 1 && 419} : 
        (target === 2) && { height: step === 2 && 500};

    return (
      <div className="a_c_s_bubble" style={div_styles}>
        <span className="a_c_s_content_wrapper" style={span_styles} onClick={() => setStep(target)}>
          <p className="a_c_s_step_label" style={p_styles}>Step 0{target + 1}</p>
          <h1 className="a_c_s_label" style={h1_styles}>{label}</h1>
          <div className="a_c_s_content">
            {children}
          </div>
        </span>
      </div>
    )
}