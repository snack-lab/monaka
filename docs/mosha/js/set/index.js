{
  // intersection
  const odds = new Set([1, 3, 5, 7, 9]);
  const squares = new Set([1, 4, 9]);
  console.log(odds.intersection(squares));
}

{
  // union
  const evens = new Set([2, 4, 6, 8]);
  const squares = new Set([1, 4, 9]);
  console.log(evens.union(squares));
}

{
  // difference
  const odds = new Set([1, 3, 5, 7, 9]);
  const squares = new Set([1, 4, 9]);
  console.log(odds.difference(squares));
}

{
  // symmetricDifference
  const evens = new Set([2, 4, 6, 8]);
  const squares = new Set([1, 4, 9]);
  console.log(evens.symmetricDifference(squares));
}

{
  // iSubsetOf
  const fours = new Set([4, 8, 12, 16]);
  const evens = new Set([2, 4, 6, 8, 10, 12, 14, 16, 18]);
  console.log(fours.isSubsetOf(evens));
}

{
  // isDisjointFrom
  const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
  const squares = new Set([1, 4, 9, 16]);
  console.log(primes.isDisjointFrom(squares));
}
