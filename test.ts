import "./core/web/mod_test.ts";
import "./core/web/router_test.ts";
import "./core/web/bodyparser_test.ts";
import "./core/web/static_test.ts";
import "./core/theme/mod_test.ts";
import "./core/theme/loader_test.ts";
import "./core/theme/loader_hub_test.ts";
import "./core/template/mod_test.ts";
import "./core/template/script_template_test.ts";

const { runTests } = Deno;

runTests();

