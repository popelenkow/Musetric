export const getLocalIp = async (): Promise<string> => {
	const rtc = new RTCPeerConnection({ iceServers: [] });

	const grepSDP = (sdp: string): string => {
		const ips: string[] = [];

		sdp.split('\r\n').forEach((line) => {
			// c.f. http://tools.ietf.org/html/rfc4566#page-39
			if (line.includes('a=candidate')) {
				// http://tools.ietf.org/html/rfc4566#section-5.13
				const parts = line.split(' ');
				// http://tools.ietf.org/html/rfc5245#section-15.1
				const addr = parts[4];
				const type = parts[7];
				if (type === 'host') {
					ips.push(addr);
				}
			}
			else if (line.includes('c=')) {
				// http://tools.ietf.org/html/rfc4566#section-5.7
				const parts = line.split(' ');
				const addr = parts[2];
				ips.push(addr);
			}
		});

		if (ips.length === 0) throw new Error();
		return ips[0];
	};

	rtc.createDataChannel('');

	const promise = new Promise<string>((resolve, reject) => {
		rtc.onicecandidate = (event): void => {
			if (!event.candidate) {
				reject();
				return;
			}
			const addr = grepSDP(`a=${event.candidate.candidate}`);
			resolve(addr);
		};
	});

	const offerDesc = await rtc.createOffer();
	await rtc.setLocalDescription(offerDesc);
	const result = await promise;
	return result;
};
