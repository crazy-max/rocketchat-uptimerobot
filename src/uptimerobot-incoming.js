/**
 * uptimerobot-incoming.js
 * Add Uptime Robot notifications via a new WebHook in Rocket.Chat
 * @license MIT
 * @version 0.1
 * @author  CrazyMax, https://github.com/crazy-max
 * @updated 2017-11-29
 * @link    https://github.com/crazy-max/rocketchat-uptimerobot
 */

/* globals console, _, s */

const getData = (obj) => {
  let statusColor = "#A63636";
  let statusText = "DOWN";
  let alertDuration = 0;
  if (obj.alertType === "2") {
    statusColor = "#36A64F";
    statusText = "UP";
    alertDuration = convertAlertDuration(obj.alertDuration);
  }

  return {
    statusColor: statusColor,
    statusText: statusText,
    isUp: obj.alertType === "2",
    monitorID: obj.monitorID,
    monitorURL: obj.monitorURL,
    monitorFriendlyName: obj.monitorFriendlyName,
    alertDetails: obj.alertDetails,
    alertDuration: alertDuration,
  };
};

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

const buildMessage = (obj) => {
  const data = getData(obj);

  let template = `Monitor is ${data.statusText}: [${data.monitorFriendlyName}](https://uptimerobot.com/dashboard.php#${data.monitorID})`;
  template += ` (${data.monitorURL}).`;
  if(data.isUp) {
    template += ` It was down for ${data.alertDuration}`;
  } else {
    template += ` Reason: ${data.alertDetails}`;
  }

  return {
    text: template,
    color: data.statusColor
  };
};

/* exported Script */
class Script {
  /**
   * @params {object} request
   */
  process_incoming_request({ request }) {
    msg = buildMessage(request.content);
    return {
      content:{
        attachments: [{
          text: msg.text,
          color: msg.color
        }]
      }
    };
  }
}
