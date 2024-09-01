export function generateRkey(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 4);
  return (timestamp + randomPart).slice(0, 15);
}
