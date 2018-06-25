import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.component.html', styleUrls: ['post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  @Input() post;
  @Output() deletePostEmitter: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Emit event to parent to delete this post card
   */
  deletePost() {
    this.post.isDeleting = true;
    this.deletePostEmitter.emit(this.post);
  }

}