
<div class="ui-dialog pr ${className}">
   {{if hasClose}}<a href="javascript:;" data-action="close" class="ui-close-btn">×</a>{{/if}}
  {{if hasTitle}}
      <div class="ui-dialog-head">${title}</div>
      {{html titleHTML}}
  {{/if}}
      <div class="ui-dialog-body">{{html innerHTML}}</div>
  {{if hasFoot}}
      <div class="ui-dialog-foot">
        {{html footHTML}}
      </div>
  {{/if}}
</div>