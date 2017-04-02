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
  approverId:           'wowens',
  requestMailSubject:   'Request An Approval',
  requestMailContent:   './template/request.html',
  rejectionMailSubject: 'The Application Is Rejected',
  rejectionMailContent: './template/rejection.html',
  approvalMailSubject:  'Got The Approval',
  approvalMailContent:  './template/approval.html',
});

flow.mailhook({ fromEmail: 'member@your-org.com', subject: 'expenditure-application-workflow', })
    .trigger('expenditure-application-workflow', { applicantEmailSelector: 'table tr:first-child td:last-child' });
```

[flowjs-example]: https://github.com/evanxd/flowjs-example
