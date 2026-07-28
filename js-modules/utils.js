export function averageBins(dataArray, start, end) {
  let sum = 0;

  for (let i = start; i < end; i++) {
    sum += dataArray[i];
  }
  return sum / (end - start);
}
