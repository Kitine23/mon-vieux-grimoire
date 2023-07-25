/**
 * La fonction moyenne calcule la moyenne d'un tableau de nombres et arrondit le résultat au nombre
 * entier le plus proche.
 * @param nums - Un tableau de nombres.
 * @returns La moyenne des nombres dans le tableau "nums", arrondie au nombre entier le plus proche.
 */
export function average(nums) {
  return Math.round(nums.reduce((a, b) => a + b) / nums.length)
}
