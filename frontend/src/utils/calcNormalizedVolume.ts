export const calcNormalizedVolume = (analyser: AnalyserNode) => {
  const pcmData = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(pcmData);
  let sum = 0.0;
  for (const amplitude of pcmData) {
    sum += amplitude * amplitude;
  }
  const rms = Math.sqrt(sum / pcmData.length);
  const normalizedVolume = Math.min(1, rms / 0.5);
  return normalizedVolume;
};

export default calcNormalizedVolume;
