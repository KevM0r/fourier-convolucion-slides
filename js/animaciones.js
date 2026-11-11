Reveal.initialize({hash:true,transition:'convex',backgroundTransition:'fade',slideNumber:'c/t',width:1100,height:700,center:true});
renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]});

const $=id=>document.getElementById(id),FT='13px Inter,sans-serif',COL={a:'#4cc9f0',b:'#f72585',c:'#80ed99',d:'#ffd166',g:'#cbd5e1'};
const ctx=id=>{const c=$(id);return[c.getContext('2d'),c.width,c.height]};
const txt=(g,s,x,y,col=COL.g,al='left',f=FT)=>{g.fillStyle=col;g.font=f;g.textAlign=al;g.fillText(s,x,y)};
function live(id,draw){const c=$(id);let on=false,t0=0;
 const loop=ts=>{if(!on)return;draw(ts-t0);requestAnimationFrame(loop)};
 const chk=()=>{const v=Reveal.getCurrentSlide().contains(c);if(v&&!on){on=true;t0=performance.now();requestAnimationFrame(loop)}if(!v)on=false};
 Reveal.on('ready',chk);Reveal.on('slidechanged',chk)}
function axes(g,x0,y0,w,h,x1,x2,y1,y2){const X=v=>x0+(v-x1)/(x2-x1)*w,Y=v=>y0+h-(v-y1)/(y2-y1)*h;
 g.strokeStyle='#64748b';g.lineWidth=1;g.beginPath();g.moveTo(x0,Y(0));g.lineTo(x0+w,Y(0));g.moveTo(X(0),y0);g.lineTo(X(0),y0+h);g.stroke();return{X,Y}}
function stems(g,A,pts,col){g.strokeStyle=col;g.fillStyle=col;g.lineWidth=2.5;pts.forEach(([k,v])=>{g.beginPath();g.moveTo(A.X(k),A.Y(0));g.lineTo(A.X(k),A.Y(v));g.stroke();g.beginPath();g.arc(A.X(k),A.Y(v),4.5,0,7);g.fill()})}
function curve(g,A,fn,x1,x2,col,n=300){g.beginPath();g.strokeStyle=col;g.lineWidth=2.5;for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n;g.lineTo(A.X(x),A.Y(fn(x)))}g.stroke()}
const sinc=u=>u==0?1:Math.sin(Math.PI*u)/(Math.PI*u);
const dconv=(x,h)=>{const y=Array(x.length+h.length-1).fill(0);x.forEach((a,i)=>h.forEach((b,j)=>y[i+j]+=a*b));return y};

/* 1 · Portada */
(()=>{const[g,W,H]=ctx('wave');live('wave',t=>{g.clearRect(0,0,W,H);
 [[1,COL.a,.5],[3,COL.b,.5],[0,COL.d,1]].forEach(([m,col,al])=>{g.beginPath();g.strokeStyle=col;g.globalAlpha=al;g.lineWidth=2.5;
  for(let x=0;x<W;x++){const u=x/W*Math.PI*4+t/600;const y=m?Math.sin(m*u)/m:Math.sin(u)+Math.sin(3*u)/3+Math.sin(5*u)/5;g.lineTo(x,H/2-y*(m?50:40))}g.stroke()});g.globalAlpha=1})})();

/* 2 · entrada, h, salida */
(()=>{const[g,W,H]=ctx('c2'),x=[1,2,3,2,1],h=[1,.6,.3],y=dconv(x,h),T=[['x[n]  entrada',x,COL.a],['h[n]  respuesta al impulso',h,COL.b],['y[n] = x∗h  salida',y,COL.c]];
 T.forEach(([n,s,col],i)=>{const x0=25+i*295,A=axes(g,x0,52,260,140,-1,8,-.2,3.4);stems(g,A,s.map((v,k)=>[k,v]),col);txt(g,n,x0,28,col,'left','600 14px Inter')});})();

/* Convolución continua animada: x=h=A·rect(t/T) */
function convAnim(id,A,T){const[g,W,H]=ctx(id),R=1.5*T+.5,S=T+.4,yT=H*.40,hT=H*.26,yB=H*.90,hB=H*.30,X=t=>45+(t+R)/(2*R)*(W-90);
 const ymax=A*A*T,yv=t=>A*A*Math.max(0,Math.min(T/2,t+T/2)-Math.max(-T/2,t-T/2));
 const ax=y=>{g.strokeStyle='#64748b';g.lineWidth=1;g.beginPath();g.moveTo(35,y);g.lineTo(W-25,y);g.stroke();
  [-T,-T/2,0,T/2,T].forEach(v=>{g.beginPath();g.moveTo(X(v),y-4);g.lineTo(X(v),y+4);g.stroke();txt(g,v,X(v),y+18,COL.g,'center')})};
 live(id,ts=>{const t=-S+((ts/8000)%1)*2*S;g.clearRect(0,0,W,H);ax(yT);ax(yB);
  g.fillStyle='rgba(76,201,240,.5)';g.fillRect(X(-T/2),yT-hT,X(T/2)-X(-T/2),hT);
  g.fillStyle='rgba(247,37,133,.5)';g.fillRect(X(t-T/2),yT-hT,X(T/2)-X(-T/2),hT);
  const a=Math.max(-T/2,t-T/2),b=Math.min(T/2,t+T/2);if(b>a){g.fillStyle='rgba(128,237,153,.9)';g.fillRect(X(a),yT-hT,X(b)-X(a),hT)}
  g.setLineDash([5,5]);g.strokeStyle='#475569';g.beginPath();for(let s=-S;s<=S;s+=.05)g.lineTo(X(s),yB-yv(s)/ymax*hB);g.stroke();g.setLineDash([]);
  g.beginPath();g.strokeStyle=COL.c;g.lineWidth=3;for(let s=-S;s<=t;s+=.03)g.lineTo(X(s),yB-yv(s)/ymax*hB);g.stroke();
  g.fillStyle=COL.c;g.beginPath();g.arc(X(t),yB-yv(t)/ymax*hB,6,0,7);g.fill();
  txt(g,'x(τ)',50,22,COL.a,'left','600 14px Inter');txt(g,'h(t−τ)',100,22,COL.b,'left','600 14px Inter');txt(g,'τ',W-12,yT-6);txt(g,'t',W-12,yB-6);
  txt(g,A,X(-T/2)-14,yT-hT+12);txt(g,'y(t)',50,yB-hB-14,COL.c,'left','600 14px Inter');txt(g,ymax,X(0)+10,yB-hB+4);
  txt(g,`t = ${t.toFixed(2)}    y(t) = ${yv(t).toFixed(2)}`,W-30,22,COL.d,'right')})}
convAnim('c3',1,1);convAnim('c8',2,2);

/* 8c · dominio de la frecuencia */
(()=>{const[g,W,H]=ctx('c8f'),P=[['X(f) = 4 sinc(2f)',f=>4*sinc(2*f),-2,2,-1.5,4.8,COL.a],['H(f) = 4 sinc(2f)',f=>4*sinc(2*f),-2,2,-1.5,4.8,COL.b],['Y(f) = 16 sinc²(2f)',f=>16*sinc(2*f)**2,-2,2,-2,17,COL.d],['y(t) = 4(2−|t|)',t=>Math.max(0,4*(2-Math.abs(t))),-3,3,-1,9,COL.c]];
 P.forEach(([n,fn,x1,x2,y1,y2,col],i)=>{const x0=22+i*248,A=axes(g,x0,40,215,150,x1,x2,y1,y2);curve(g,A,fn,x1,x2,col);txt(g,n,x0,24,col,'left','600 13px Inter');
  txt(g,i<3?'f (Hz)':'t (s)',x0+215,A.Y(0)+16,COL.g,'right')});
 txt(g,'×',241,115,COL.d,'center','700 22px Inter');txt(g,'=',489,115,COL.d,'center','700 22px Inter');txt(g,'F⁻¹',737,115,COL.d,'center','700 18px Inter')})();

/* 9a · voltear y desplazar (discreto) */
(()=>{const[g,W,H]=ctx('c9'),x=[1,2,3],h=[1,-1],y=dconv(x,h),hv=(n,k)=>(n-k>=0&&n-k<h.length)?h[n-k]:0;
 live('c9',ts=>{const st=Math.floor(ts/1900)%5,n=Math.min(st,3);g.clearRect(0,0,W,H);
  const A=axes(g,50,40,800,110,-2,6,-3.4,3.6),B=axes(g,50,215,800,110,-2,6,-3.4,3.6);
  for(let k=-2;k<=6;k++){txt(g,k,A.X(k),A.Y(0)+14,'#64748b','center');txt(g,k,B.X(k),B.Y(0)+14,'#64748b','center')}
  stems(g,A,x.map((v,k)=>[k,v]),COL.a);stems(g,A,[[n,h[0]],[n-1,h[1]]].map(([k,v])=>[k,v]),COL.b);
  g.fillStyle='rgba(247,37,133,.1)';g.fillRect(A.X(n-1.4),A.Y(3.5),A.X(n+.4)-A.X(n-1.4),A.Y(-3.4)-A.Y(3.5));
  const sh=st==4?[0,1,2,3]:[...Array(n+1).keys()];stems(g,B,sh.map(m=>[m,y[m]]),COL.c);
  txt(g,'k',W-15,A.Y(0)-6);txt(g,'n',W-15,B.Y(0)-6);
  txt(g,'x[k]',55,30,COL.a,'left','600 14px Inter');txt(g,'h[n−k]  (n = '+n+')',110,30,COL.b,'left','600 14px Inter');txt(g,'y[n]',55,205,COL.c,'left','600 14px Inter');
  const T=x.map((v,k)=>[v,hv(n,k)]).filter(p=>p[1]!=0).map(p=>`${p[0]}·(${p[1]})`).join(' + ');
  txt(g,st==4?'y = [1, 1, 1, −3]':`y[${n}] = ${T} = ${y[n]}`,W/2,H-12,COL.d,'center','600 17px "JetBrains Mono",monospace')})})();

/* 10 · eco */
(()=>{const[g,W,H]=ctx('c10'),x=Array.from({length:50},(_,i)=>Math.sin(i*.9)*Math.exp(-i/12)),h=Array(40).fill(0);h[0]=1;h[39]=.6;const y=dconv(x,h);
 [['x[n] nota',x,COL.a],['h[n] eco',h,COL.b],['y[n] = x∗h',y,COL.c]].forEach(([n,s,col],i)=>{const x0=20+i*295,A=axes(g,x0,34,265,130,0,y.length,-1.2,1.3);
  stems(g,A,s.map((v,k)=>[k,v]).filter(p=>Math.abs(p[1])>.01),col);txt(g,n,x0,22,col,'left','600 14px Inter')})})();