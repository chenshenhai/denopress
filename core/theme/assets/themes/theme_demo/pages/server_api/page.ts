/// <reference path="./../../../../../theme.d.ts" />


export default $Theme.Page({
  async data(ctx: $Theme.Context, api: $Theme.Api) {
    const data = await api.testServer.getData();
    return {
      type: data.type,
      list: data.todolist,
    }
  }
})