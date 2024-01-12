class Complex {
    public real: number;

    public imag: number;

    constructor(real: number = 0, imag: number = 0) {
        this.real = real;
        this.imag = imag;
    }

    add(other: Complex): Complex {
        return new Complex(this.real + other.real, this.imag + other.imag);
    }

    sub(other: Complex): Complex {
        return new Complex(this.real - other.real, this.imag - other.imag);
    }

    mul(other: Complex): Complex {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real,
        );
    }

    static fromPolar(r: number, theta: number): Complex {
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}

const fft = (signal: Complex[]): Complex[] => {
    const N = signal.length;
    if (N <= 1) return signal;

    const even = fft(signal.filter((_, index) => index % 2 === 0));
    const odd = fft(signal.filter((_, index) => index % 2 !== 0));

    const result: Complex[] = new Array<Complex>(N);
    for (let k = 0; k < N / 2; k++) {
        const e = -2 * Math.PI * k / N;
        const value = Complex.fromPolar(1, e).mul(odd[k]);
        result[k] = even[k].add(value);
        result[k + N / 2] = even[k].sub(value);
    }

    return result;
};

const input: Complex[] = [new Complex(1), new Complex(2), new Complex(3), new Complex(4),
    new Complex(4), new Complex(3), new Complex(2), new Complex(1)];
const output = fft(input);

output.forEach((value, index) => {
    console.log(`output[${index}]: ${value.real.toFixed(2)} + ${value.imag.toFixed(2)}i`);
});
