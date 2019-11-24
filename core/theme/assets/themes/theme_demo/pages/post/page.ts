/// <reference path="./../../../../../theme.d.ts" />


export default $Theme.Page({
  async data() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          key1: 'async val'
        })
      }, 10)
    })
  }
})