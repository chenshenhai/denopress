import { strings } from "./../../deps.ts";

// export { decode, encode } from "https://deno.land/std@v0.17.0/strings/mod.ts";
// export { format as byteFormat } from "https://deno.land/x/bytes_formater@1.1.0/mod.ts";

const { decode, encode } = strings;

export { format as byteFormat } from "./bytes_formater.ts";
export { decode, encode };
export { replaceParams } from "./util.ts";


