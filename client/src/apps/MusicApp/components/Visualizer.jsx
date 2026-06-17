import { useAudioVisualizer } from '../hooks/useAudioVisualizer';

export default function Visualizer({ audioElement }) {
  const canvasRef = useAudioVisualizer(audioElement);

  return (
    <canvas
      ref={canvasRef}
      className="visualizer-canvas"
      width={800}
      height={150}
    />
  );
}
