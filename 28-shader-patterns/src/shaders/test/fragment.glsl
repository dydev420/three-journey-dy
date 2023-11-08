#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}



void main()
{
    float strength = 0.0;

    // P1 - x
    // strength = vUv.x;

    // P2 - inv X
    // strength = 1.0 - vUv.x;

    // P1 - y
    // strength = vUv.x;

    // P2 - inv y
    // strength = 1.0 - vUv.x;

    // P3
    // strength = vUv.y * 10.0;

    // P4
    // strength = sin(vUv.y * 50.0);

    // P4
    // strength = 1.0 - sin(vUv.y * 50.0);

    // P5 - Window Blinds effect Blinds effects ?????????
    // strength = mod(vUv.y * 30.0, 1.0);

    // P6
    // strength = mod(vUv.y, 0.2);

    // P7 - Website header???
    // strength = mod(vUv.y, 0.8);

    // P8
    // strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

     // P9
    // strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // P10
    // strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // P11
    // strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // P12 - Pixel screen effect????
    // strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.5, strength);
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // P13
    // float xBar = 0.0;
    // float yBar = 0.0;

    // strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.5, strength);
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // xBar = strength;

    // strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);
    // strength *= step(0.5, mod(vUv.y * 10.0, 1.0));
    // yBar = strength;

    // strength = xBar + yBar;

    // P14
    // float xBar = 0.0;
    // float yBar = 0.0;

    // strength = mod(vUv.x * 10.0 - 0.65, 1.0);
    // strength = step(0.5, strength);
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // xBar = strength;

    // strength = mod(vUv.x * 10.0 - 0.0, 1.0);
    // strength = step(0.8, strength);
    // strength *= step(0.5, mod(vUv.y * 10.0 - 0.65, 1.0));
    // yBar = strength;

    // strength = xBar + yBar;

    // P15 - Stich Effect
    // float xBar = 0.0;
    // float yBar = 0.0;

    // strength = mod(vUv.x * 10.0 - 0.65, 1.0);
    // strength = step(0.5, strength);
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // xBar = strength;

    // strength = mod(vUv.x * 10.0 - 0.0, 1.0);
    // strength = step(0.8, strength);
    // strength *= step(0.5, mod(vUv.y * 10.0 - 0.15, 1.0));
    // yBar = strength;

    // strength = xBar + yBar;

    // P16 - Stich Effect
    // float xBar = 0.0;
    // float yBar = 0.0;

    // strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.4, strength);
    // strength *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // xBar = strength;

    // strength = mod(vUv.x * 10.0 + 0.2, 1.0);
    // strength = step(0.8, strength);
    // strength *= step(0.4, mod(vUv.y * 10.0 , 1.0));
    // yBar = strength;

    // strength = xBar + yBar;

    // P17
    // strength = abs((vUv.x - 0.5) * 2.0);

     // P18
    // strength = 1.0 - abs((vUv.x - 0.5) * 2.0);

    // P19
    // strength = abs(vUv.x - 0.5);
    // strength *= abs(vUv.y -0.5);

    // P20
    // strength = abs(vUv.x - 0.5);
    // strength += abs(vUv.y -0.5);

    // P21
    // strength = abs(vUv.x - 0.5);
    // strength -= abs(vUv.y -0.5);

    // P22
    // float strengthX = abs(vUv.x - 0.5);
    // float strengthY = abs(vUv.y -0.5);

    // strength = min(strengthX, strengthY);

    // P23
    // float strengthX = abs(vUv.x - 0.5);
    // float strengthY = abs(vUv.y -0.5);

    // strength = max(strengthX, strengthY);

    // P24
    // float strengthX = abs(vUv.x - 0.5);
    // float strengthY = abs(vUv.y -0.5);

    // strength = max(strengthX, strengthY);
    // strength = step(0.4, strength);

    // P24
    // float strengthX = abs(vUv.x - 0.5);
    // float strengthY = abs(vUv.y -0.5);

    // strength = max(strengthX, strengthY);
    // strength = step(0.1, strength);

    // P25 (P24 alt) (Overlapping Squares)
    // float strengthX = abs(vUv.x - 0.5);
    // float strengthY = abs(vUv.y - 0.5);

    // strength = max(strengthX, strengthY);
    // float strengthVoid = step(0.3, strength);
    // float strengthOuter = 1.0 - step(0.4, strength);

    // strength = strengthVoid;
    // strength *= strengthOuter;

    // P27
    // strength = vUv.x;
    // strength *= 10.0;
    // strength = floor(strength);
    // strength /= 10.0;

     // P28
    // strength = vUv.x;
    // strength *= 10.0;
    // strength = floor(strength);
    // strength /= 10.0;

    // float strengthY = floor(vUv.y * 10.0) / 10.0;
    // strength *= strengthY;

    // P29
    // strength = random(vUv);

    // P30 - MineCraft Box ???????-----???????
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0) / 10.0
    // );

    // strength = random(gridUv);

    // P31
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0
    // );

    // strength = random(gridUv);

    // P32 - vector length Example ?????
    // strength = length(vUv);

    // P33 Center Gradient Dot
    // strength = length(vUv - 0.5);

    // P33 Hitscane Dot ??????? ------   ?????
    // strength = distance(vUv, vec2(0.5, 0.2));

    // P34
    // strength = 1.0 - distance(vUv, vec2(0.5, 0.5));

    // P35
    // strength = 1.0 - (distance(vUv, vec2(0.5, 0.5)) * 10.0);

    // P36 SpotLight/PointLight Dot ??????????? ---------- ?????????
    // strength = 0.01 / distance(vUv, vec2(0.5, 0.5));

    // P37
    // vec2 lightUv = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // strength = 0.01 / distance(lightUv, vec2(0.5));

    // P38
    // vec2 lightUvX = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float lightX = 0.01 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(
    //     vUv.y * 0.1 + 0.45,
    //     vUv.x * 0.5 + 0.25
    // );
    // float lightY = 0.01 / distance(lightUvY, vec2(0.5));

    // strength = lightX * lightY;

    // P39
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
   
    // vec2 lightUvX = vec2(
    //     rotatedUv.x * 0.1 + 0.45,
    //     rotatedUv.y * 0.5 + 0.25
    // );
    // float lightX = 0.01 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(
    //     rotatedUv.y * 0.1 + 0.45,
    //     rotatedUv.x * 0.5 + 0.25
    // );
    // float lightY = 0.01 / distance(lightUvY, vec2(0.5));

    // strength = lightX * lightY;

    // P40 Circles
    // strength = distance(vUv, vec2(0.5));

    // P42 Point Light Fake ???????? ------ ??????
    // strength = 1.0 -  distance(vUv, vec2(0.5));

    // P43
    // strength = step(0.25, distance(vUv, vec2(0.5)));

    // P44
    // strength = 1.0 - step(0.25, distance(vUv, vec2(0.5)));

    // P45
    // strength = abs(distance(vUv, vec2(0.5)) * 2.0 - 0.5);

    // P46 Ring ???????????? ------([])------ ???????????????
    // strength = 1.0 - abs(distance(vUv, vec2(0.5)) * 2.0 - 0.5) * 3.0;

    // P47 Ring ???????????? ------([])------ ???????????????
    // strength = step(0.01, abs(distance(vUv, vec2(0.5)) * 2.0 - 0.5));

    // P48 Ring ???????????? ------([])------ ???????????????
    // strength = 1.0 - step(0.25, abs(distance(vUv, vec2(0.5)) * 2.0 - 0.5) * 10.0);

    // P49 Sine Function - Shape Generator ?????????? ------- (()) ------ ????????
    // vec2 waveUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 20.0) * 0.2
    // );
    // strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) * 2.0 - 0.5));


    // P50
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 20.0) * 0.2,
    //     vUv.y + sin(vUv.x * 20.0) * 0.2
    // );
    // strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // P51
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));


    // P52
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.3,
    //     vUv.y + sin(vUv.x * 100.0) * 0.3
    // );
    // strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // P53
    // float angle = atan(vUv.x, vUv.y);
    // strength = angle;

    // P54
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // strength = angle;

    // P55
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI;
    // strength = abs(angle);

     // P56
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI;
    // strength = 1.0 - abs(angle);

    // P57
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= 2.0 * PI;
    // angle += 0.5;
    // strength = angle;

    // P58 Sun Rays Effect ?????? --------- ?????????
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0;
    // angle = mod(angle, 1.0);
    // strength = angle;


    // P59
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // strength = sin(angle * 100.0);

    // P60 Wave Circle ??????????? ---------------(())-----------???????????????????
    // float radius = 0.25;
    
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinValue = sin(angle * 100.0);

    // radius += sinValue * 0.02;
    // strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // P61 Perlin Noise ????????? ------- ??????
    // strength = cnoise(vUv * 20.0);

    // P62 
    // strength = step(0.1, cnoise(vUv * 10.0));

    // P63
    // strength = abs(cnoise(vUv * 10.0));

    // P64
    // strength = 1.0 - abs(cnoise(vUv * 30.0));

    // P65
    // strength = sin(cnoise(vUv * 10.0) * 25.0);

    // P66
    // strength = 1.0 - sin(cnoise(vUv * 20.0) * 15.0);

    // P67
    // strength = sin(cnoise(vUv * 10.0) * 25.0) * 20.0;

    // P68
    // strength = 1.0 - sin(cnoise(vUv * 20.0) * 15.0) * 20.0;

    // P69 Sharpness ??????? ------------- ??????????????????????
    strength = step(0.8, sin(cnoise(vUv * 10.0) * 25.0));

    

    // ________END of Shaders___________ //

    // Clamp Strength from 0.0 to 1.0
    strength = clamp(strength, 0.0, 1.0);

    // Colored version
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);


    // Black n White version
    // gl_FragColor = vec4(strength, 0.0, strength, 1.0);
}