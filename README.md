# Flow.js
A Webhook-featured workflow automation framework.

## Samples
Initialize the Flow and Team object instances.
```js
var flowjs = require('node-flowjs');
var flow = new flowjs.Flow(); // It helps create automation workflows.
var team = new flowjs.Team(); // It helps get team members information.
```

Create a workflow for employees to apply for expenditure.
```js
flow.setup('/expenditure-application-workflow')
    .if(data => { return data.fromEmail === data.applicantEmail })
      .mail(team.findManager(data.fromEmail).email, './ask-approval.html')
    .if(data => { return data.fromEmail != 'director@samples.com' && data.approved })
      .mail(team.findManager(data.fromEmail).email, './ask-approval.html')
    .if(data => { return data.fromEmail === 'director@samples.com' && data.approved })
      .mail(data.applicantEmail, './got-approval.html')
      .mail('secretary@samples.com', './got-approval.html');
```
