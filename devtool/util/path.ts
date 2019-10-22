export function backPath(path: string) {
  const list = path.split('/');
  list.pop();
  return list.join('/');
}