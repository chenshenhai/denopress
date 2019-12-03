
export function parseToCamelName(name: string): string {
  return name.replace(/\_(\w)/g, function(match, letter){
    return letter.toUpperCase();
  });
}

export function parseToLineName(name: string): string {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

