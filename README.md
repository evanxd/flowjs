# Flow.js
A Webhook-featured workflow automation framework.

## Samples

### Initialize the Flow and Team object instances
```js
var flowjs = require('node-flowjs');
var flow = new flowjs.Flow(); // It helps create automation workflows.
var org = new flowjs.Organization(); // It helps get team members information.
```

### Create a workflow for employees to apply for expenditure

#### JavaScript Version
```js
flow.setup('/expenditure-application-workflow', (data) => {
  if (data.fromEmail === data.applicantEmail) {
    flow.mail(org.findManager(data.fromEmail).email, 'Ask for The Approval', 'Ask for The Approval');
  }
  if (data.fromEmail != 'director@samples.com' && data.approved) {
    flow.mail(org.findManager(data.fromEmail).email, 'Ask for The Approval', 'Ask for The Approval');
  }
  if (data.fromEmail === 'director@samples.com' && data.approved) {
    flow.mail(data.applicantEmail, 'Got The Approval', 'Got The Approval')
    flow.mail('secretary@samples.com', 'Got The Approval', 'Got The Approval');
  }
});
```

#### XML Version
```xml
<flow setup="expenditure-application-workflow">
  <if condition="${data.fromEmail === data.applicantEmail}">
    <mail to="${findManager(data.fromEmail).email}" subject="Ask for The Approval" content="./ask-approval.html" />
  </if>
  <if condition="${data.fromEmail != 'director@samples.com' && data.approved}">
    <mail to="${findManager(data.fromEmail).email}" subject="Ask for The Approval" content="./ask-approval.html" />
  </if>
  <if condition="${data.fromEmail === 'director@samples.com' && data.approved}">
    <mail to="${data.applicantEmail}" subject="Got The Approval" content="./got-approval.html" />
    <mail to="secretary@samples.com"  subject="Got The Approval" content="./got-approval.html" />
  </if>
</flow>
```
