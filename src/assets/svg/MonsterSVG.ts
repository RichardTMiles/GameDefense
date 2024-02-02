const monsterImage = new Image();

const monsterSVG = (color1 = 'rgb(134,30,30)', color2 = 'rgb(0,191,255)') => `
<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color: ${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color: ${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <polygon points="20,0 40,20 20,40 0,20" fill="url(#grad1)" stroke="blue" stroke-width="2"/>
  <path d="M 0 20 L 20 0 L 40 20 L 20 40 Z" fill="none" stroke="black" stroke-width="1" opacity="0.5"/>
</svg>`;

monsterImage.src = 'data:image/svg+xml;base64,' + btoa(monsterSVG());


export default monsterImage;