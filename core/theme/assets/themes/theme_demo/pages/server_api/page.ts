/// <reference path="./../../../../../theme.d.ts" />


export default $Theme.Page({
  async data(opts) {
    const data = await opts.api.testServer.getData();
    return {
      type: data.type,
      list: data.todolist,
    }
  }
})