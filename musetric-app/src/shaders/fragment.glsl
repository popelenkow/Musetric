#version 300 es

precision highp float;

uniform sampler2D uImage;
uniform float uArr[8];
uniform int a;
out vec4 outColor;

void main() {
	outColor = vec4(texture(uImage, vec2(0, 1)).r, 0, 0, 1);
}
