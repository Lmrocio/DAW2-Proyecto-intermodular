import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentResolve: (() => void) | null = null;
  private currentReject: ((reason?: any) => void) | null = null;

  constructor(private ngZone: NgZone) {}

  cancel() {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    this.currentUtterance = null;
    if (this.currentReject) {
      this.currentReject('cancelled');
    }
    this.currentResolve = null;
    this.currentReject = null;
  }

  speak(text: string): Promise<void> {
    this.cancel(); // ensure previous stopped

    return new Promise((resolve, reject) => {
      const synth = window.speechSynthesis;
      if (!synth) {
        reject('no-speech-synthesis');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        // nothing here; consumer can react
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.currentResolve = null;
        this.currentReject = null;
        resolve();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        this.currentResolve = null;
        this.currentReject = null;
        reject(e);
      };

      this.currentUtterance = utterance;
      this.currentResolve = resolve;
      this.currentReject = reject;

      // try to pick spanish voice quickly with retries
      const selectVoiceAndSpeak = (retries = 5) => {
        const voices = synth.getVoices();
        if (voices.length > 0) {
          const spanishVoice = voices.find(v => v.lang && v.lang.startsWith('es'));
          if (spanishVoice) {
            utterance.voice = spanishVoice;
          }
          try { synth.speak(utterance); } catch (e) { reject(e); }
          return;
        }
        if (retries > 0) {
          setTimeout(() => selectVoiceAndSpeak(retries - 1), 120);
        } else {
          try { synth.speak(utterance); } catch (e) { reject(e); }
        }
      };

      selectVoiceAndSpeak();
    });
  }
}
