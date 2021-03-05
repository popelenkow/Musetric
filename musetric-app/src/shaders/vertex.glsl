#version 300 es

in vec4 aPosition;

uniform vec2 uResolution;

void main() {
	// convert the position from pixels to 0.0 to 1.0
	vec2 zeroToOne = aPosition.xy / uResolution;

	// convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// convert from 0->2 to -1->+1 (clipspace)
	vec2 clipSpace = zeroToTwo - 1.0;

	gl_Position = vec4(clipSpace, 0, 1);
}
