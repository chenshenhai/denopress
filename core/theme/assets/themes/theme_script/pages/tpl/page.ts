/// <reference path="./../../../../../page.d.ts" />
export default $ThemePage({
  data() {
    return {
      list: [ 'item-001', 'item-002', 'item-003', 'item-004'],
      listChild: [
        {
          name: "item-1",
          children: [
            {
              name: "child-1-1",
            },
            {
              name: "child-1-2",
            }
          ]
        },
        {
          name: "item-2",
          children: [
            {
              name: "child-2-1",
            },
            {
              name: "child-2-2",
            },
            {
              name: "child-3-2",
            }
          ]
        }
      ],
      isShow: true,
      str: 'Hello! I am a string!',
    };
  }
})