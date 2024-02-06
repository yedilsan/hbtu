document.addEventListener('DOMContentLoaded', function () {
	const candle = document.getElementById('blowCandle');
	let isBlown = false;

	document.querySelector('.candle').addEventListener('click', function () {
		blowOutCandle();
	});

	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then(function (stream) {
			const audioContext = new (window.AudioContext ||
				window.webkitAudioContext)();
			const microphone = audioContext.createMediaStreamSource(stream);
			const analyser = audioContext.createAnalyser();
			microphone.connect(analyser);
			analyser.fftSize = 256;
			const dataArray = new Uint8Array(analyser.fftSize);
			let lastVolume = 0;

			function detectBlow() {
				analyser.getByteFrequencyData(dataArray);
				const currentVolume =
					dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;

				console.log('Current volume:', currentVolume);

				const threshold = 80;

				if (!isBlown && currentVolume > threshold) {
					blowOutCandle();
					isBlown = true;
				}

				lastVolume = currentVolume;

				requestAnimationFrame(detectBlow);
			}

			detectBlow();
		})
		.catch(function (error) {
			console.error('Error accessing microphone:', error);
		});

	function blowOutCandle() {
		const flameElement = document.querySelector('.flame');
		const blinkingGlowElement = document.querySelector('.blinking-glow');
		const glowElement = document.querySelector('.glow');

		if (flameElement && blinkingGlowElement && glowElement) {
			flameElement.style.display = 'none';
			blinkingGlowElement.style.display = 'none';
			glowElement.style.display = 'none';

			flameElement.style.animationPlayState = 'paused';
		}
	}
});
