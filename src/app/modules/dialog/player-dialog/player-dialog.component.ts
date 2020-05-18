import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Track } from '../../../@core/utils/player.service';

@Component({
  selector: 'ngx-player-dialog',
  templateUrl: 'player-dialog.component.html',
  styleUrls: ['player-dialog.component.scss'],
})
export class PlayerDialogComponent implements OnInit, OnDestroy {

  // // @Input()
  @Input() tracks: Track[];
  // // @HostBinding('class.collapsed')

  // @Input() title: string;
  // @Input() content: string;
  // @Input() actions: { label: string, icon?: string, status?: string, action?: () => void }[];

  collapsed: boolean;

  // tracks = [];
  track: Track;
  player: HTMLAudioElement;
  shuffle: boolean;

  currentTrackIndex = 0;
  // currentTrack: Track;

  @ViewChild('player', {static: true}) playerRef: ElementRef;

  constructor(
    // private playerService: PlayerService,
    protected ref: NbDialogRef<PlayerDialogComponent>) {
    // this.track = this.playerService.random();

    // this.createPlayer();
  }

  ngOnInit() {
    this.player = this.playerRef.nativeElement;
    this.track = this.tracks[0];
    this.player.src = this.track.url;
    this.player.load();
    // this.player.play();
    // this.createPlayer();
    this.player.play();
  }

  prev() {
    if (!this.player.loop) {
      if (this.shuffle) {
        this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
        this.track = this.tracks[this.currentTrackIndex];
      } else {
        this.currentTrackIndex = this.currentTrackIndex === 0 ? this.tracks.length - 1 : this.currentTrackIndex - 1;
        this.track = this.tracks[this.currentTrackIndex];
      }
    }

    this.reload();
  }

  next() {
    if (!this.player.loop) {
      if (this.shuffle) {
        this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
        this.track = this.tracks[this.currentTrackIndex];
      } else {
        this.currentTrackIndex = this.currentTrackIndex === this.tracks.length - 1 ? 0 : this.currentTrackIndex + 1;
        this.track = this.tracks[this.currentTrackIndex];
      }
    }

    this.reload();
  }

  playPause() {
    if (this.player.paused) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
  }

  toggleLoop() {
    this.player.loop = !this.player.loop;
  }

  setVolume(volume: number) {
    this.player.volume = volume / 100;
  }

  getVolume(): number {
    return this.player.volume * 100;
  }

  setProgress(duration: number) {
    this.player.currentTime = this.player.duration * duration / 100;
  }

  getProgress(): number {
    return this.player.currentTime / this.player.duration * 100 || 0;
  }

  // private createPlayer() {
  //   this.player = new Audio();
  //   this.player.onended = () => this.next();
  //   this.setTrack();
  // }

  private reload() {
    this.setTrack();
    this.player.play();
  }

  private setTrack() {
    this.player.src = this.track.url;
    this.player.load();
  }

  dismiss() {
    this.ref.close();
  }

  ngOnDestroy() {
    this.player.pause();
    this.player.src = '';
    this.player.load();
  }
}
