export function getBallsFromOvers(overs: number) {
  const completedOvers = Math.floor(overs);
  const extraBalls = Math.round((overs - completedOvers) * 10);
  return (completedOvers * 6) + extraBalls;
}