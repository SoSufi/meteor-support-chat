# meteor-support-chat

## Install

Install using Meteor:

```sh
$ meteor add ralof:support-chat
```



## Basic Usage

This package is pretty rough and ugly on the inside, but it seem to work reasonably fine. Eventually I might get around to do some refactoring.

Just add   `{{> supportChatClient}}` for the client and   `{{> supportChatAdmin}}` for the supporters. Give the role `chatSupporter` for those who should be able to pick up requests.

New in version 0.0.2: `{{> supportRequestAlert}}` will show a red badge if there are pending support requests, clicking it will trigger data-action="supporterChat/open"

The `strings`, texts, can changed with the `config`:

```javascript
        SupportChat.config({
            emailNotifications: true,
            emailSender: "SupportChat@yourserver.domain",
            emailTopic: "Support request",
            emailBody: "Chat request on Your Server",
            strings: {"supportIsAvailable": "I am overriding the text for supportIsAvailable"}
        });
```

Type `SupportChat.settings.strings` in the console to get a list of strings

Layout is currently based on `Bootstrap CSS`

Feel free to contribute.

Known bugs
- Hitting ENTER does not send message on Firefox
