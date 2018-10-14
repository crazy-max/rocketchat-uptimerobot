/**
 * uptimerobot-incoming.js
 * Add Uptime Robot notifications via a new WebHook in Rocket.Chat
 * @license MIT
 * @version 0.2
 * @author  CrazyMax, https://github.com/crazy-max
 * @updated 2018-10-14
 * @link    https://github.com/crazy-max/rocketchat-uptimerobot
 */

/* globals console, _, s */

const USERNAME = 'Uptime Robot';
const AVATAR_URL = 'https://raw.githubusercontent.com/crazy-max/rocketchat-uptimerobot/master/res/avatar.png';

const convertAlertDuration = (seconds) => {
  let days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds  -= minutes * 60;

  let result = "";
  if (days > 0) {
    result += " " + days + " days";
  }
  if (hours > 0) {
    result += " " + hours + " hours";
  }
  if (minutes > 0) {
    result += " " + minutes + " minutes";
  }
  if (seconds > 0) {
    result += " " + seconds + " seconds";
  }

  return result;
};

/* exported Script */
class Script {
  /**
   * @params {object} request
   */
  process_incoming_request({ request }) {
    let data = request.content;
    let attachmentColor = `#A63636`;
    let statusText = `DOWN`;
    let isUp = data.alertType === `2`;
    if (isUp) {
      attachmentColor = `#36A64F`;
      statusText = `UP`;
    }

    let attachmentText = `[${data.monitorFriendlyName}](https://uptimerobot.com/dashboard.php#${data.monitorID}) is ${statusText} (${data.monitorURL}).\n`;
    if (isUp) {
      attachmentText += `It was down for ${convertAlertDuration(data.alertDuration)}`;
    } else {
      attachmentText += `Reason: ${data.alertDetails}`;
    }

    return {
      content:{
        username: USERNAME,
        icon_url: AVATAR_URL,
        text: `Monitor [${data.monitorFriendlyName}](https://uptimerobot.com/dashboard.php#${data.monitorID}) status has changed.`,
        attachments: [{
          text: attachmentText,
          color: attachmentColor
        }]
      }
    };
  }
}
