
export interface TypeSubcommandOpts {
  method: Function;
  info: string;
}

export interface TypeCommanderOpts{ 
  version: string;
}

interface TypeCommander {
  getVersion(): string;
  setSubcommand(name: string, opts: TypeSubcommandOpts): void;
  execute(): Promise<void>;
}

export class Commander implements TypeCommander {
  private _version : string;
  private _subcommandMap: Map<string, TypeSubcommandOpts>;
  private _isReady: boolean = false;

  constructor(opts: TypeCommanderOpts) {
    this._version = opts.version;
    this._subcommandMap = new Map();
  }

  public getVersion(): string {
    return this._version;
  }

  public setSubcommand(name: string, opts: TypeSubcommandOpts): void {
    this._subcommandMap.set(name, opts);
  }

  public async execute(): Promise<void> {
    if (this._isReady === true) {
      return;
    }
    await this._exec();
  }

  private async _exec(): Promise<void> {
    const args: string[] = Deno.args;
    const subcmd: string|undefined = args[1];
    let hasCommand: boolean = false;
    if (typeof subcmd === "string") {
      const subOpts: TypeSubcommandOpts|undefined = this._subcommandMap.get(subcmd);
      if (subOpts) {
        hasCommand = true;
        await subOpts.method();
      }
    }

    if (hasCommand !== true) {
      console.log(`${this._version}`);
    }
  }
}