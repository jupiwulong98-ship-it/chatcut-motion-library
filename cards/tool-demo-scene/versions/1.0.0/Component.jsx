const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const props = item.props || {};
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const seconds = frame / fps;
  const backgroundIn = interpolate(seconds, [0, 0.18], [0, 1], clamp);
  const screenIn = spring({ frame: frame - 0.1 * fps, fps, config: { damping: 24, stiffness: 180 } });
  const logoIn = spring({ frame: frame - 0.22 * fps, fps, config: { damping: 17, stiffness: 240 } });
  const presenterIn = spring({ frame: frame - 0.28 * fps, fps, config: { damping: 23, stiffness: 220 } });
  const screenOpacity = interpolate(seconds, [0.1, 0.3], [0, 1], clamp);
  const logoOpacity = interpolate(seconds, [0.22, 0.32], [0, 1], clamp);
  const presenterOpacity = interpolate(seconds, [0.28, 0.4], [0, 1], clamp);
  const screenScale = Math.max(0.85, Math.min(1.08, Number(props.screenScale)));
  const logoScale = Math.max(0.7, Math.min(1.2, Number(props.logoScale)));
  const presenterScale = Math.max(0.7, Math.min(1.2, Number(props.presenterScale)));
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "#000", overflow: "hidden" };
  // Reference geometry is measured in a 1280 x 720 local coordinate system.
  const sceneStyle = { position: "absolute", width: 1280, height: 720, transformOrigin: "0 0", transform: "scale(" + width / 1280 + "," + height / 720 + ")" };
  const gridStyle = { position: "absolute", inset: 0, width: 1280, height: 720, opacity: backgroundIn, filter: "blur(0.6px)", zIndex: 0 };
  const screenStyle = { position: "absolute", left: 130, top: 92, width: 1020, height: 570, borderRadius: 54, overflow: "hidden", backgroundColor: "#151515", zIndex: 1, opacity: screenOpacity, transform: "translateY(" + (1 - screenIn) * 22 + "px) scale(" + (0.94 + screenIn * 0.06) * screenScale + ")" };
  const videoStyle = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
  const logoStyle = { position: "absolute", left: 77, top: 47, width: 160, height: 163, boxSizing: "border-box", padding: 9, borderRadius: 18, backgroundColor: "#fff", border: "1.5px solid #161616", zIndex: 2, opacity: logoOpacity, transform: "scale(" + (0.7 + logoIn * 0.3) * logoScale + ")" };
  const imageStyle = { width: "100%", height: "100%", objectFit: "contain", display: "block" };
  const presenterStyle = { position: "absolute", left: 56, top: 457, width: 234, height: 234, boxSizing: "border-box", borderRadius: "50%", boxShadow: "0 0 10px #85E4FF", border: "3px solid #95DAE9", zIndex: 3, opacity: presenterOpacity, transform: "translate(" + (1 - presenterIn) * -30 + "px," + (1 - presenterIn) * 12 + "px) scale(" + (0.9 + presenterIn * 0.1) * presenterScale + ")" };
  // The footage itself is clipped; the glow remains outside this inner circle.
  const circleStyle = { position: "absolute", inset: 0, borderRadius: "50%", clipPath: "circle(50% at 50% 50%)", overflow: "hidden", backgroundColor: "#161616" };
  const missingStyle = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 20, textAlign: "center" };
  const labels = [props.label1, props.label2, props.label3];
  const rays = [];
  for (let x = 40; x <= 1240; x += 76) rays.push({ x });
  const gridRows = [32, 70, 101, 132, 161, 189, 214, 707, 665, 622, 584, 550, 520, 495];
  return <div style={rootStyle}>
    <div style={sceneStyle}>
      <svg style={gridStyle} viewBox="0 0 1280 720">
        <defs><linearGradient id="tool-demo-grid-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#000" stopOpacity="0"/><stop offset="26%" stopColor="#000" stopOpacity="0.94"/><stop offset="36%" stopColor="#000" stopOpacity="0.99"/><stop offset="61%" stopColor="#000" stopOpacity="0.99"/><stop offset="74%" stopColor="#000" stopOpacity="0.7"/><stop offset="100%" stopColor="#000" stopOpacity="0"/></linearGradient></defs>
        <g stroke={props.gridColor} strokeWidth="3" fill="none">
          {rays.map(({ x }) => <path key={x} d={"M " + x + " 0 L 640 360 L " + x + " 720"}/>)}
          {gridRows.map((y) => { const d = "M 0 " + y + " H 1280"; return <path key={y} d={d}/>; })}
        </g>
        <rect width="1280" height="720" fill="url(#tool-demo-grid-shade)"/>
      </svg>
      <div style={screenStyle}>
        {props.screenVideo ? <Video src={props.screenVideo} style={videoStyle} muted /> : <div style={missingStyle}>待绑定主工具录屏</div>}
      </div>
      <div style={logoStyle}>
        {props.logoImage ? <Img src={props.logoImage} style={imageStyle} /> : <div style={missingStyle}>待绑定 Logo</div>}
      </div>
      <div style={presenterStyle}><div style={circleStyle}>
        {props.presenterVideo ? <Video src={props.presenterVideo} style={videoStyle} /> : <div style={missingStyle}>待绑定人物口播</div>}
      </div></div>
      {labels.map((text, index) => {
        const delay = 0.6 + index * 0.5;
        const progress = spring({ frame: frame - delay * fps, fps, config: { damping: 19, stiffness: 340, mass: 0.75 } });
        const opacity = interpolate(seconds, [delay, delay + 0.07], [0, 1], clamp);
        const labelStyle = { position: "absolute", right: 129, top: 139 + index * 112, minHeight: 98, boxSizing: "border-box", maxWidth: 660, padding: index === 1 ? "9px 13px" : "9px 30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "32px 0 0 32px", backgroundColor: props.accentColor, color: props.textColor, fontFamily: '"Songti SC", "Noto Serif CJK SC", serif', fontWeight: 900, fontSize: 54, lineHeight: 1.2, whiteSpace: "normal", overflowWrap: "anywhere", zIndex: 4, opacity, transformOrigin: "right center", transform: "translateX(" + (1 - progress) * 150 + "px) scale(" + (0.88 + progress * 0.12) + ")" };
        return <div key={index} style={labelStyle} data-label={index + 1}>{text}</div>;
      })}
    </div>
  </div>;
};
