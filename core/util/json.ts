

export function writeJsonSync(path: string, data: string, options: any): void {
  Deno.writeTextFileSync(path, JSON.stringify(data, options));
}

export function readJsonSync(path: string): any {
  const text = Deno.readTextFileSync(path);
  let result = undefined;
  try {
    result = JSON.parse(text);
  } catch (err) {
    console.log(err);
  }
  return result;
}
