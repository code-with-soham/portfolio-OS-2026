import { useEffect, useRef } from 'react';

export function useAudioVisualizer(audioElement) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    // Initialize Web Audio API on first interaction/play
    const initAudio = () => {
      if (audioContextRef.current) return;

      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        // Ensure crossOrigin is set on the audio element to allow CORS streams
        audioElement.crossOrigin = 'anonymous';
        
        // Check if already connected (in React StrictMode, this might fire twice)
        if (!sourceRef.current) {
          const source = ctx.createMediaElementSource(audioElement);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceRef.current = source;
        }
      } catch (err) {
        console.error('AudioContext initialization failed:', err);
      }
    };

    const handlePlay = () => {
      initAudio();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    audioElement.addEventListener('play', handlePlay);

    // Draw function
    const draw = () => {
      if (!canvasRef.current || !analyserRef.current) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        // Create a gradient for the bars
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.4)');   // purple-600
        gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.8)'); // pink-500
        gradient.addColorStop(1, 'rgba(251, 146, 60, 1)');     // orange-400

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2; // + gap
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement]);

  return canvasRef;
}
