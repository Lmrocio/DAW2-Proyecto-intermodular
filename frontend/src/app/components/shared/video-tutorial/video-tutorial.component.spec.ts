import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTutorialComponent } from './video-tutorial.component';

describe('VideoTutorialComponent', () => {
  let component: VideoTutorialComponent;
  let fixture: ComponentFixture<VideoTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoTutorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default video source', () => {
    expect(component.videoSrc).toBe('Qué_es_Bizum_y_cómo_funciona.webm');
  });

  it('should have default Spanish subtitles', () => {
    expect(component.subtitlesEs).toBe('tutorial-bizum.vtt');
  });

  it('should have default English subtitles', () => {
    expect(component.subtitlesEn).toBe('tutorial-bizum-en.vtt');
  });

  it('should generate correct video path', () => {
    expect(component.videoPath).toBe('assets/videos/Qué_es_Bizum_y_cómo_funciona.webm');
  });

  it('should generate correct Spanish subtitles path', () => {
    expect(component.subtitlesEsPath).toBe('assets/subtitles/tutorial-bizum.vtt');
  });

  it('should generate correct English subtitles path', () => {
    expect(component.subtitlesEnPath).toBe('assets/subtitles/tutorial-bizum-en.vtt');
  });

  it('should have transcription text', () => {
    expect(component.transcription).toBeTruthy();
    expect(component.transcription.length).toBeGreaterThan(0);
  });
});
