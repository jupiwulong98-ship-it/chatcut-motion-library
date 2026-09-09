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
  const topLabels = [p.top1,p.top2];
  const sideLabels = [p.side1,p.side2];
  const presenterStyle = { position:"absolute",left:74,top:176,width:565,height:730,borderRadius:52,overflow:"hidden",border:"4px solid #62BACC",boxSizing:"border-box",...motion(0.02,-35,0,0.96) };
  const outlineStyle = { position:"absolute",left:690,top:78,width:1132,height:835,border:"6px dashed #fff",borderRadius:70,boxSizing:"border-box",opacity:fade(0.12) };
  const proofStyle = { position:"absolute",left:739,top:343,width:989,height:525,borderRadius:55,overflow:"hidden",...motion(0.18,30,0,0.97) };
  const logoStyle = { position:"absolute",left:1545,top:119,width:175,height:175,...motion(0.24,0,0,0.85) };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
{grid}
<div style={presenterStyle}>{p.presenterVideo ? <Video src={p.presenterVideo} muted style={mediaStyle}/> : null}</div>
  <div style={outlineStyle}/>
  <div style={proofStyle}>{p.proofImage ? <Img src={p.proofImage} style={mediaStyle}/> : null}</div>
  {topLabels.map((text,index) => {
    const style = { position:"absolute",left:index===0?710:1110,top:126,width:index===0?382:438,minHeight:110,padding:"12px 8px",boxSizing:"border-box",borderRadius:38,backgroundColor:p.accentColor,color:p.textColor,fontSize:index===0?52:48,fontWeight:900,lineHeight:1.35,textAlign:"center",...motion(0.3+index*0.25,0,15,0.94) };
    return <div key={index} style={style}>{text}</div>;
  })}
  {sideLabels.map((text,index) => {
    const style = { position:"absolute",left:658,top:393+index*112,minWidth:182,minHeight:102,padding:"10px 14px",boxSizing:"border-box",borderRadius:30,backgroundColor:p.accentColor,color:p.textColor,fontSize:58,fontWeight:900,lineHeight:1.35,textAlign:"center",...motion(0.95+index*0.4,-45,0,0.94) };
    return <div key={index} style={style}>{text}</div>;
  })}
  {p.logoImage ? <div style={logoStyle}><Img src={p.logoImage} style={containStyle}/></div> : null}
  </div></div>;
};
