import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {

  constructor() {
  }


  /**
   * Will transform given milliseconds to "** time ago"
   * example "1 hour ago"
   * @param value milliseconds
   * @returns {any}
   */
  transform(value: any): any {
    return this.timeSince(value);
  }

  timeSince(date) {

    let seconds = Math.floor((Date.now() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 0) {
      return interval + (interval === 1 ? " year ago" : " years ago");
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
      return interval + (interval === 1 ? " month ago" : " months ago");
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
      return interval + (interval === 1 ? " day ago" : " days ago");
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
      return interval + (interval === 1 ? " hour ago" : " hours ago");
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
      return interval + (interval === 1 ? " minute ago" : " minutes ago");
    }
    if (Math.floor(seconds) > 10) {
      return Math.floor(seconds) + " seconds ago";
    }

    return "just now";
  }

}
