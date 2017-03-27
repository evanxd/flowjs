# webhook
A Webhook-featured workflow automation framework.

## Samples
Create a workflow for employees to apply for expenditure.
```js
var hook = new Webhook();
hook.hook('/expenditure')
    .if(data => { return employee.isLevelOne(data.from) })
    .tigger(level-2@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'level-2@samples.com' })
    .tigger(level-3@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'level-3@samples.com' })
    .tigger('level-4@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'manager-level-4@samples.com' })
    .tigger(data.applicant, 'got-approval.html');
```
