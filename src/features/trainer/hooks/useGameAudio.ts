import { useAudioPlayer } from "expo-audio";

const replay = (player: ReturnType<typeof useAudioPlayer>) => {
  void player
    .seekTo(0)
    .then(() => player.play())
    .catch(() => undefined);
};

export function useGameAudio() {
  const tapPlayer = useAudioPlayer(
    require("../../../../assets/audio/ui-tap.wav"),
  );
  const successPlayer = useAudioPlayer(
    require("../../../../assets/audio/ui-success.wav"),
  );
  const alertPlayer = useAudioPlayer(
    require("../../../../assets/audio/ui-alert.wav"),
  );

  return {
    tap: () => replay(tapPlayer),
    success: () => replay(successPlayer),
    alert: () => replay(alertPlayer),
  };
}
