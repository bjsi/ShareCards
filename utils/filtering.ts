export function uniqueByKey<T, A>(list: T[], getter: (item: T) => A) {
  const set = new Set<A>();
  return list.filter(x => !set.has(getter(x)));
}
