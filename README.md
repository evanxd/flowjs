# Flow.js
A Webhook-featured workflow automation framework.

## Samples

### Initialize a flowjs instance
```js
var flow = require('node-flowjs');
```

### Create a workflow for employees to apply for expenditure

#### JavaScript Version
```js
flow.setup('expenditure-application-workflow', data => {
  if (data.email === data.applicantEmail) {
    flow.actions.mail(flow.organization.findManager(data.email).email,
    	'Ask for The Approval', './ask-approval.html', data);
  }
  if (data.email != 'director@your-org.com' && data.approved) {
    flow.actions.mail(flow.organization.findManager(data.email).email,
    	'Ask for The Approval', './ask-approval.html', data);
  }
  if (data.email === 'director@your-org.com' && data.approved) {
    flow.actions.mail(data.applicantEmail,
      'Got The Approval', './got-approval.html', data);
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
