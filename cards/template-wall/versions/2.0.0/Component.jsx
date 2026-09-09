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
  const labels = [p.label1,p.label2];
  const templateStyle = { position:"absolute",left:170,top:80,width:1630,height:800,borderRadius:80,overflow:"hidden",...motion(0.06,0,24,0.96) };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
{grid}
<div style={templateStyle}>{p.templateImage ? <Img src={p.templateImage} style={mediaStyle}/> : null}</div>
<div style={{ position: "absolute", left: 84, top: 688, width: 348, height: 348, borderRadius: "50%", overflow: "hidden", clipPath: "circle(50%)", boxSizing: "border-box", border: "4px solid #8FD5E5", ...motion(0.22, -35, 12, 0.9) }}>{p.presenterVideo ? <Video src={p.presenterVideo} muted style={mediaStyle} /> : null}</div>
  {labels.map((text,index) => {
    const style = { position:"absolute",left:0,top:86+index*176,minWidth:index===0?325:430,minHeight:144,padding:"12px 34px",boxSizing:"border-box",borderRadius:"0 76px 76px 0",backgroundColor:index===0?p.accentColor:p.secondaryColor,color:p.textColor,fontSize:84,fontWeight:500,lineHeight:1.3,...motion(0.35+index*0.55,-90,0,0.96) };
    return text ? <div key={index} style={style}>{text}</div> : null;
  })}
  </div></div>;
};
