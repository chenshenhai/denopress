import * as deno from "deno";
import { test, assert, assertEqual } from "./../lib/testing.ts";
import { Request, Req } from "./../../lib/request.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const testAdr = "127.0.0.1:4322"

const reqDataList =  [
  "GET / HTTP/1.1",
  `Host: ${testAdr}`,
  "Connection: keep-alive",
  "Pragma: no-cache",
  "Cache-Control: no-cache",
  "Upgrade-Insecure-Requests: 1",
  "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
  "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Accept-Encoding: gzip, deflate, br",
  "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8"
];

const acceptReqHeadersData = {
  "method": "GET",
  "protocol": "HTTP/1.1",
  "href": "/",
  "pathname": "/",
  "search": "",
  "Host": `${testAdr}`,
  "Connection": "keep-alive",
  "Pragma": "no-cache",
  "Cache-Control": "no-cache",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
};

test(async function testUnitRequest() {
  const listener = deno.listen("tcp", testAdr);
  listener.accept().then(async conn => {
    const buf = encoder.encode(reqDataList.join('\r\n'));
    await conn.write(buf);
    conn.close();
  });
  const conn = await deno.dial("tcp", testAdr);
  const request: Req = new Request(conn);
  await request.init();
  const reqData = await request.getHeaders();
  const resultStr = JSON.stringify(reqData)
  const acceptStr = JSON.stringify(acceptReqHeadersData);
  assert( resultStr === acceptStr);
})