const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const p = item.props || {};
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const seconds = frame / fps;
  const fade = (delay, duration = 0.1) => interpolate(seconds, [delay, delay + duration], [0, 1], clamp);
  const enter = (delay, damping = 22) => spring({ frame: frame - delay * fps, fps, config: { damping, stiffness: 250, mass: 0.8 } });
  const motion = (delay, x = 0, y = 20, scale = 0.94) => {
    const progress = enter(delay);
    return { opacity: fade(delay), transform: `translate(${x * (1 - progress)}px, ${y * (1 - progress)}px) scale(${scale + (1 - scale) * progress})` };
  };
  const mediaStyle = { display: "block", width: "100%", height: "100%", objectFit: "cover" };
  const containStyle = { ...mediaStyle, objectFit: "contain" };
  const sceneStyle = { position: "absolute", width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${width / 1920}, ${height / 1080})` };
  // A ceiling and floor recede into a dark central space; horizontal lines are essential.
  const gridLines = [];
  for (let x = -120; x <= 2040; x += 114) {
    const path = `M ${x} 0 L 960 540 L ${x} 1080`;
    gridLines.push(<path key={`ray-${x}`} d={path} />);
  }
  const rows = [48, 105, 152, 198, 242, 284, 321, 742, 780, 825, 876, 933, 998, 1060];
  rows.forEach((y) => { gridLines.push(<path key={`row-${y}`} d={`M 0 ${y} H 1920`} />); });
  const gridStyle = { position: "absolute", inset: 0, opacity: fade(0, 0.16) };
  const shadeStyle = { position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,.88) 29%,#000 42%,#000 60%,rgba(0,0,0,.65) 74%,transparent 100%)" };
  const grid = <div style={gridStyle}><svg width="1920" height="1080" viewBox="0 0 1920 1080"><g stroke={p.gridColor} strokeWidth="4" fill="none">{gridLines}</g></svg><div style={shadeStyle} /></div>;
  const screenStyle = { position:"absolute",left:570,top:125,width:975,height:850,borderRadius:20,overflow:"hidden",...motion(0.2,100,0,0.96) };
  const logoStyle = { position:"absolute",left:116,top:80,width:260,height:260,...motion(0.05,0,0,0.8) };
  const reveal = fade(0.8,0.24);
  const boxStyle = { position:"absolute",left:p.boxX,top:p.boxY,width:p.boxW,height:p.boxH,border:`7px solid ${p.accentColor}`,borderRadius:50,boxSizing:"border-box",clipPath:`inset(0 ${(1-reveal)*100}% 0 0)`,opacity:fade(0.8,0.05) };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000" };
  return <div style={rootStyle}><div style={sceneStyle}>
{grid}
<div style={screenStyle}>{p.screenVideo ? <Video src={p.screenVideo} muted style={mediaStyle}/> : null}</div>
  <div style={logoStyle}>{p.logoImage ? <Img src={p.logoImage} style={containStyle}/> : null}</div>
<div style={{ position: "absolute", left: 84, top: 688, width: 348, height: 348, borderRadius: "50%", overflow: "hidden", clipPath: "circle(50%)", boxSizing: "border-box", border: "4px solid #8FD5E5", ...motion(0.22, -35, 12, 0.9) }}>{p.presenterVideo ? <Video src={p.presenterVideo} muted style={mediaStyle} /> : null}</div>
  <div style={boxStyle}/>

  </div></div>;
};
