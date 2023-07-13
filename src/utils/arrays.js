export function average(nums) {
  return Math.round(nums.reduce((a, b) => a + b) / nums.length)
}
