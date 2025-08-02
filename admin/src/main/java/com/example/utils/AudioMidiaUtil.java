package com.example.utils;

import uk.co.caprica.vlcj.factory.MediaPlayerFactory;
import uk.co.caprica.vlcj.player.base.MediaPlayer;

public class AudioMidiaUtil {
     private final MediaPlayer mediaPlayer;
     private String audioUrl;

    public AudioMidiaUtil(String audioUrl) {
        MediaPlayerFactory factory = new MediaPlayerFactory();
        this.mediaPlayer = factory.mediaPlayers().newMediaPlayer();
        mediaPlayer.controls().pause(); // inicia carregado, mas pausado
        this.audioUrl = audioUrl;
    }

    public void play() {
        if (audioUrl != null && !audioUrl.isEmpty()) {
            mediaPlayer.media().play(audioUrl);
        } else {
            System.err.println("URL do áudio inválida ou vazia.");
        }
    }

    public void toggle() {
        if (mediaPlayer.status().isPlaying()) {
            mediaPlayer.controls().pause();
        } else {
            mediaPlayer.controls().play();
        }
    }

    

    public void forward() {
        mediaPlayer.controls().skipTime(5000);
    }

    public void backward() {
        mediaPlayer.controls().skipTime(-5000);
    }

    public void stop() {
        mediaPlayer.controls().stop();
    }

    public void release() {
        mediaPlayer.release();
    }

    public MediaPlayer getMediaPlayer(){
        return mediaPlayer;
    }
}
