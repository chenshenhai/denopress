interface TypeTheme {
  config: {
    [key: string]: string|boolean|object|number;
  }
}

interface TypeThemeLoader {
  loadTheme(): any;
}