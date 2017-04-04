# Flow.js
A Webhook-featured workflow automation framework.

## How-to
Initialize a flowjs instance.
```js
var flow = require('node-flowjs');
```

Create a workflow for employees to apply for expenditure. You could check and use the full example with the [flowjs-example][flowjs-example] repository.
```js
flow.setup('expenditure-application-workflow', {
      approverId: 'wowens',
    })
    .mailhook({
      subject: 'expenditure-application-workflow',
      applicantIdSelector: 'table tr:first-child td:last-child',
    });
```

[flowjs-example]: https://github.com/evanxd/flowjs-example
